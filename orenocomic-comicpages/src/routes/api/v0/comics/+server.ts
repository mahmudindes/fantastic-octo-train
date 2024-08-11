import type { RequestHandler } from './$types';
import { addComic, countComic, listComic } from '$lib/server/service';
import {
	capitalPeriod,
	formDataDate,
	formDataNumber,
	headerBearerToken,
	queryOrderBys,
	response500
} from '$lib/server/helper';
import { GenericError, PermissionError } from '$lib/server/model';
import type { NewComic } from '$lib/server/model';
import { AuthError, AuthErrorKind, parseAccessToken } from '$lib/server/auth';
import { database } from '$lib/server/database';

export const GET: RequestHandler = async ({ url }) => {
	const db = database();

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const orderBys = queryOrderBys(url.searchParams.getAll('order_by'));
		const page = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('limit')) || 10;

		const comicExternals = url.searchParams.has('comic_external')
			? url.searchParams
					.getAll('comic_external')
					.map((ce) => {
						const kvs = ce.split(',');
						return new Map(
							kvs.map((kv) => {
								const ces = kv.split('=', 2);
								return [ces[0], decodeURIComponent(ces[1])];
							})
						);
					})
					.reduce((a, v) => ({ ...a, ...v }))
			: undefined;

		const paramLinks = { comicExternals, orderBys, page, limit };

		const totalCount = await countComic(db, paramLinks);
		const r = await listComic(db, paramLinks);

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
};

export const POST: RequestHandler = async ({ request }) => {
	const db = database();

	let reshd: { [h: string]: string } = {
		'Content-Type': 'application/json; charset=utf-8',
		'X-Content-Type-Options': 'nosniff'
	};

	try {
		const a = await parseAccessToken(headerBearerToken(request.headers.get('Authorization')));

		let v: NewComic = {
			code: ''
		};
		switch (request.headers.get('content-type')) {
			case 'application/json':
				v = await request.json();
				break;
			case 'application/x-www-form-urlencoded':
				const f = await request.formData();
				v.code = f.get('code') as string;
				v.languageID = formDataNumber(f.get('languageID'));
				v.languageIETF = (f.get('languageIETF') as string | null) ?? undefined;
				v.publishedFrom = formDataDate(f.get('publishedFrom'));
				v.publishedTo = formDataDate(f.get('publishedTo'));
				v.totalChapter = formDataNumber(f.get('totalChapter'));
				v.totalVolume = formDataNumber(f.get('totalVolume'));
				v.nsfw = formDataNumber(f.get('nsfw'));
				v.nsfl = formDataNumber(f.get('nsfl'));
				v.additionals = undefined;
				break;
		}

		const r = await addComic(db, v, a);

		reshd['Location'] = new URL(request.url).pathname + '/' + r.code;
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
