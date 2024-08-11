import type { RequestHandler } from './$types';
import { addComicCover, countComicCover, listComicCover } from '$lib/server/service';
import {
	capitalPeriod,
	formDataNumber,
	headerBearerToken,
	queryOrderBys,
	response500
} from '$lib/server/helper';
import { GenericError, PermissionError } from '$lib/server/model';
import type { NewComicCover } from '$lib/server/model';
import { AuthError, AuthErrorKind, parseAccessToken } from '$lib/server/auth';
import { database } from '$lib/server/database';

/* export const GET: RequestHandler = async ({ url }) => {
	const db = database();

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const orderBys = queryOrderBys(url.searchParams.getAll('order_by'));
		const page = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('limit')) || 10;

		const paramLinks = { orderBys, page, limit };

		const totalCount = await countComicCover(db, paramLinks);
		const r = await listComicCover(db, paramLinks);

		reshd['X-Total-Count'] = String(totalCount);
		reshd['X-Pagination-Limit'] = String(limit);
		return new Response(JSON.stringify(r), { headers: reshd });
	} catch (e) {
		let r = response500;

		switch (true) {
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
}; */

export const POST: RequestHandler = async ({ params, request }) => {
	const db = database();

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const a = await parseAccessToken(headerBearerToken(request.headers.get('Authorization')));

		let v: NewComicCover = {
			rid: '',
			relativeURL: ''
		};
		switch (request.headers.get('content-type')) {
			case 'application/json':
				v = await request.json();
				v.comicID = undefined;
				v.comicCode = params.code;
				break;
			case 'application/x-www-form-urlencoded':
				const f = await request.formData();
				v.comicID = undefined;
				v.comicCode = params.code;
				v.rid = f.get('rid') as string;
				v.websiteID = formDataNumber(f.get('websiteID'));
				v.websiteDomain = (f.get('websiteDomain') as string | null) ?? undefined;
				v.relativeURL = f.get('relativeURL') as string;
				v.priority = formDataNumber(f.get('priority'));
				break;
		}

		const r = await addComicCover(db, v, a);

		reshd['Location'] = new URL(request.url).pathname + '/' + r.rid;
		return new Response(JSON.stringify(r), { headers: reshd, status: 201 });
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
