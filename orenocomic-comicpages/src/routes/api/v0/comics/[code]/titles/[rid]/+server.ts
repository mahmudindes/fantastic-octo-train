import type { RequestHandler } from './$types';
import {
	deleteComicTitleBySID,
	getComicTitleBySID,
	updateComicTitleBySID
} from '$lib/server/service';
import { GenericError, NotFoundError, PermissionError } from '$lib/server/model';
import type { SetComicTitle } from '$lib/server/model';
import {
	capitalPeriod,
	formDataBoolean,
	formDataNumber,
	headerBearerToken,
	response500
} from '$lib/server/helper';
import { AuthError, AuthErrorKind, parseAccessToken } from '$lib/server/auth';
import { database } from '$lib/server/database';

export const GET: RequestHandler = async ({ params }) => {
	const db = database();

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const r = await getComicTitleBySID(db, { comicCode: params.code, rid: params.rid });

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

		let v: SetComicTitle = {};
		switch (request.headers.get('content-type')) {
			case 'application/json':
				v = await request.json();
				v.comicID = undefined;
				v.comicCode = undefined;
				break;
			case 'application/x-www-form-urlencoded':
				const f = await request.formData();
				v.comicID = undefined;
				v.comicCode = undefined;
				v.rid = (f.get('rid') as string | null) ?? undefined;
				v.languageID = formDataNumber(f.get('languageID'));
				v.languageIETF = (f.get('languageIETF') as string | null) ?? undefined;
				v.title = (f.get('title') as string | null) ?? undefined;
				v.synonym = formDataBoolean(f.get('synonym'));
				v.romanized = formDataBoolean(f.get('romanized'));
				break;
		}

		const r = await updateComicTitleBySID(db, { comicCode: params.code, rid: params.rid }, v, a);

		if (!r) return new Response(undefined, { status: 204 });

		reshd['Location'] = new URL(request.url).pathname + '/' + r.rid;
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

		await deleteComicTitleBySID(db, { comicCode: params.code, rid: params.rid });

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
