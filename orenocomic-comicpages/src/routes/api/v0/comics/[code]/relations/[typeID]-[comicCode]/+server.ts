import type { RequestHandler } from './$types';
import {
	deleteComicRelationBySID,
	getComicRelationBySID,
	updateComicRelationBySID
} from '$lib/server/service';
import { GenericError, NotFoundError, PermissionError } from '$lib/server/model';
import type { SetComicRelation } from '$lib/server/model';
import { capitalPeriod, formDataNumber, headerBearerToken, response500 } from '$lib/server/helper';
import { AuthError, AuthErrorKind, parseAccessToken } from '$lib/server/auth';
import { database } from '$lib/server/database';

export const GET: RequestHandler = async ({ params }) => {
	const db = database();

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const r = await getComicRelationBySID(db, {
			parentCode: params.code,
			typeID: Number(params.typeID),
			childCode: params.comicCode
		});

		return new Response(JSON.stringify(r), { headers: reshd });
	} catch (e) {
		let r = response500;

		switch (true) {
			case e instanceof NotFoundError:
				r.error = { status: '404', detail: capitalPeriod(e.message) };
				break;
			case e instanceof GenericError:
				r.error = { status: '400', detail: capitalPeriod(e.message) };
				break;
			case e instanceof Error:
				console.log(e);
				break;
		}

		return new Response(JSON.stringify(r), { headers: reshd, status: Number(r.error.status) });
	} finally {
		await db.destroy();
	}
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const db = database();

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const a = await parseAccessToken(headerBearerToken(request.headers.get('Authorization')));

		let v: SetComicRelation = {};
		switch (request.headers.get('content-type')) {
			case 'application/json':
				v = await request.json();
				v.parentID = undefined;
				v.parentCode = undefined;
				break;
			case 'application/x-www-form-urlencoded':
				const f = await request.formData();
				v.parentID = undefined;
				v.parentCode = undefined;
				v.typeID = formDataNumber(f.get('typeID'));
				v.typeCode = (f.get('typeCode') as string | null) ?? undefined;
				v.childID = formDataNumber(f.get('childID'));
				v.childCode = (f.get('childCode') as string | null) ?? undefined;
				break;
		}

		const r = await updateComicRelationBySID(
			db,
			{
				parentCode: params.code,
				typeID: Number(params.typeID),
				childCode: params.comicCode
			},
			v,
			a
		);

		if (!r) return new Response(undefined, { status: 204 });

		reshd['Location'] = new URL(request.url).pathname + '/' + r.typeID + '-' + r.childCode;
		return new Response(JSON.stringify(r), { headers: reshd });
	} catch (e) {
		let r = response500;

		switch (true) {
			case e instanceof AuthError:
				switch (e.kind) {
					case AuthErrorKind.Malformed:
					case AuthErrorKind.Expired:
					case AuthErrorKind.Unauthorized:
						reshd['WWW-Authenticate'] = 'Bearer error="invalid_token"';
						r.error = { status: '401', detail: capitalPeriod(e.message) };
						break;
					case AuthErrorKind.Unknown:
						console.log(e);
						break;
				}
				break;
			case e instanceof PermissionError:
				r.error = { status: '403', detail: capitalPeriod(e.message) };
				break;
			case e instanceof NotFoundError:
				r.error = { status: '404', detail: capitalPeriod(e.message) };
				break;
			case e instanceof GenericError:
				r.error = { status: '400', detail: capitalPeriod(e.message) };
				break;
			case e instanceof Error:
				console.log(e);
				break;
		}

		return new Response(JSON.stringify(r), { headers: reshd, status: Number(r.error.status) });
	} finally {
		await db.destroy();
	}
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	const db = database();

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const a = await parseAccessToken(headerBearerToken(request.headers.get('Authorization')));

		await deleteComicRelationBySID(
			db,
			{
				parentCode: params.code,
				typeID: Number(params.typeID),
				childCode: params.comicCode
			},
			a
		);

		return new Response(undefined, { status: 204 });
	} catch (e) {
		let r = response500;

		switch (true) {
			case e instanceof AuthError:
				switch (e.kind) {
					case AuthErrorKind.Malformed:
					case AuthErrorKind.Expired:
					case AuthErrorKind.Unauthorized:
						reshd['WWW-Authenticate'] = 'Bearer error="invalid_token"';
						r.error = { status: '401', detail: capitalPeriod(e.message) };
						break;
					case AuthErrorKind.Unknown:
						console.log(e);
						break;
				}
				break;
			case e instanceof PermissionError:
				r.error = { status: '403', detail: capitalPeriod(e.message) };
				break;
			case e instanceof NotFoundError:
				r.error = { status: '404', detail: capitalPeriod(e.message) };
				break;
			case e instanceof GenericError:
				r.error = { status: '400', detail: capitalPeriod(e.message) };
				break;
			case e instanceof Error:
				console.log(e);
				break;
		}

		return new Response(JSON.stringify(r), { headers: reshd, status: Number(r.error.status) });
	} finally {
		await db.destroy();
	}
};
