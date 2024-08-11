import { createRemoteJWKSet, jwtVerify } from 'jose';
import { JOSEError, JWSInvalid, JWTExpired } from 'jose/errors';
import { GenericError } from './model';
import { OAUTH_AUDIENCE, OAUTH_ISSUER, OAUTH_PERMISSION_PREFIX } from '$env/static/private';

const METADATA = await discover(OAUTH_ISSUER);
const JWKS = createRemoteJWKSet(new URL(METADATA.JWKSURI));

interface Metadata {
	Issuer: string;
	JWKSURI: string;
}

async function discover(issuer: string): Promise<Metadata> {
	const r = { Issuer: '', JWKSURI: '' };

	const oauthDiscovery = issuer + '.well-known/oauth-authorization-server';
	const oauthResponse = await fetch(oauthDiscovery);
	if (oauthResponse.status < 400) {
		const { issuer, jwks_uri } = await oauthResponse.json();
		r.Issuer = issuer;
		r.JWKSURI = jwks_uri;
	} else {
		const oidcDiscovery = issuer + '.well-known/openid-configuration';
		const oidcResponse = await fetch(oidcDiscovery);
		if (oidcResponse.status < 400) {
			const { issuer, jwks_uri } = await oidcResponse.json();
			r.Issuer = issuer;
			r.JWKSURI = jwks_uri;
		}
	}

	if (issuer != r.Issuer) {
		throw new AuthError('issuer did not match, expected ' + issuer + ' got ' + r.Issuer);
	}

	return r;
}

export interface AccessToken {
	Subject?: string;
	Expiration?: number;
	Others?: Map<string, any>;

	getClaim(name: string): any;
	hasScope(scope: string): boolean;
	hasPermission(permission: string): boolean;
}

export async function parseAccessToken(token: string): Promise<AccessToken> {
	if (!token) throw new AuthError('invalid access token', AuthErrorKind.Unauthorized);

	const t = await jwtVerify(token, JWKS, {
		issuer: OAUTH_ISSUER,
		audience: OAUTH_AUDIENCE
	}).catch((e) => {
		switch (true) {
			case e instanceof JWSInvalid:
				throw new AuthError(e.message, AuthErrorKind.Malformed);
			case e instanceof JWTExpired:
				throw new AuthError('expired access token', AuthErrorKind.Expired);
			case e instanceof JOSEError:
				throw new AuthError(e.message, AuthErrorKind.Unauthorized);
		}
		throw new AuthError(typeof e === 'string' ? e : e.toString());
	});

	return {
		Subject: t.payload.sub,
		Expiration: t.payload.exp,
		Others: new Map(Object.entries(t.payload)),
		getClaim: function (name: string): any {
			return t.payload[name];
		},
		hasScope: function (scope: string): boolean {
			return String(t.payload['scope']).split(' ').includes(scope);
		},
		hasPermission: function (permission: string): boolean {
			const p = t.payload['permissions'];

			switch (typeof p) {
				case 'object':
					if (Array.isArray(p)) {
						// Auth0 RBAC
						return p.includes(permission);
					}
					break;
				case 'string':
					return p.split(' ').includes(permission);
			}

			return false;
		}
	};
}

export function tokenPermissionKey(...s: string[]): string {
	let key = OAUTH_PERMISSION_PREFIX;
	s.forEach((s) => (key += '.' + s));
	return key;
}

export enum AuthErrorKind {
	Unknown,
	Unauthorized,
	Expired,
	Malformed
}

export class AuthError extends GenericError {
	kind: AuthErrorKind;

	constructor(
		message?: string,
		kind: AuthErrorKind = AuthErrorKind.Unknown,
		options?: ErrorOptions
	) {
		super(message, options);
		this.kind = kind;
		this.name = AuthError.name;
	}
}
