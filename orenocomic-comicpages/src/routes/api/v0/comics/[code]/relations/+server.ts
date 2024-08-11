import type { RequestHandler } from './$types';
import { addComicRelation, countComicRelation, listComicRelation } from '$lib/server/service';
import {
	capitalPeriod,
	formDataNumber,
	headerBearerToken,
	queryOrderBys,
	response500
} from '$lib/server/helper';
import { GenericError, PermissionError } from '$lib/server/model';
import type { NewComicRelation } from '$lib/server/model';
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

		const totalCount = await countComicRelation(db, paramLinks);
		const r = await listComicRelation(db, paramLinks);

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

		let v: NewComicRelation = {};
		switch (request.headers.get('content-type')) {
			case 'application/json':
				v = await request.json();
				v.parentID = undefined;
				v.parentCode = params.code;
				break;
			case 'application/x-www-form-urlencoded':
				const f = await request.formData();
				v.parentID = undefined;
				v.parentCode = params.code;
				v.typeID = formDataNumber(f.get('typeID'));
				v.typeCode = (f.get('typeCode') as string | null) ?? undefined;
				v.childID = formDataNumber(f.get('childID'));
				v.childCode = (f.get('childCode') as string | null) ?? undefined;
				break;
		}

		const r = await addComicRelation(db, v, a);

		reshd['Location'] = new URL(request.url).pathname + '/' + r.typeID + '-' + r.childCode;
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
