import type { RequestHandler } from './$types';
import {
	addCategoryRelation,
	countCategoryRelation,
	listCategoryRelation
} from '$lib/server/service';
import {
	capitalPeriod,
	formDataNumber,
	headerBearerToken,
	queryOrderBys,
	response500
} from '$lib/server/helper';
import { GenericError, PermissionError } from '$lib/server/model';
import type { NewCategoryRelation } from '$lib/server/model';
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

		const totalCount = await countCategoryRelation(db, paramLinks);
		const r = await listCategoryRelation(db, paramLinks);

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

		let v: NewCategoryRelation = {};
		switch (request.headers.get('content-type')) {
			case 'application/json':
				v = await request.json();
				v.typeID = Number(params.typeID);
				v.typeCode = undefined;
				v.parentID = undefined;
				v.parentCode = params.code;
				break;
			case 'application/x-www-form-urlencoded':
				const f = await request.formData();
				v.typeID = Number(params.typeID);
				v.typeCode = undefined;
				v.parentID = undefined;
				v.parentCode = params.code;
				v.childID = formDataNumber(f.get('childID'));
				v.childCode = (f.get('childCode') as string | null) ?? undefined;
				break;
		}

		const r = await addCategoryRelation(db, v, a);

		reshd['Location'] = new URL(request.url).pathname + '/' + r.childCode;
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
