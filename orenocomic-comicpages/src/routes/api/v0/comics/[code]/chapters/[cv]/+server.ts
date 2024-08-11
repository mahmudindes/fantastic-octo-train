import type { RequestHandler } from './$types';
import {
	deleteComicChapterBySID,
	getComicChapterBySID,
	updateComicChapterBySID
} from '$lib/server/service';
import { GenericError, NotFoundError, PermissionError } from '$lib/server/model';
import type { SetComicChapter } from '$lib/server/model';
import { capitalPeriod, formDataDate, headerBearerToken, response500 } from '$lib/server/helper';
import { AuthError, AuthErrorKind, parseAccessToken } from '$lib/server/auth';
import { database } from '$lib/server/database';

export const GET: RequestHandler = async ({ params }) => {
	const db = database();

	const cv = params.cv.split('+', 2);

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const r = await getComicChapterBySID(db, {
			comicCode: params.code,
			chapter: decodeURIComponent(cv[0]),
			version: cv[1] ? decodeURIComponent(cv[1]) : null
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

	const cv = params.cv.split('+', 2);

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const a = await parseAccessToken(headerBearerToken(request.headers.get('Authorization')));

		let v: SetComicChapter = {};
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
				v.chapter = (f.get('chapter') as string | null) ?? undefined;
				v.version = (f.get('version') as string | null) ?? undefined;
				v.volume = (f.get('volume') as string | null) ?? undefined;
				v.releasedAt = formDataDate(f.get('releasedAt'));
				break;
		}

		const r = await updateComicChapterBySID(
			db,
			{
				comicCode: params.code,
				chapter: decodeURIComponent(cv[0]),
				version: cv[1] ? decodeURIComponent(cv[1]) : null
			},
			v,
			a
		);

		if (!r) return new Response(undefined, { status: 204 });

		let slug = encodeURIComponent(r.chapter);
		if (r.version) slug += '+' + encodeURIComponent(r.version);

		reshd['Location'] = new URL(request.url).pathname + '/' + slug;
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

	const cv = params.cv.split('+', 2);

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const a = await parseAccessToken(headerBearerToken(request.headers.get('Authorization')));

		await deleteComicChapterBySID(
			db,
			{
				comicCode: params.code,
				chapter: decodeURIComponent(cv[0]),
				version: cv[1] ? decodeURIComponent(cv[1]) : null
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
