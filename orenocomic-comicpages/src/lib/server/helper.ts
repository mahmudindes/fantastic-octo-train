import type { OrderBy } from './model';

export function capitalPeriod(s: string): string {
	if (s == '') return '';

	s = s.charAt(0).toUpperCase() + s.slice(1);
	switch (s.charAt(-1)) {
		case '.':
		case '!':
		case '?':
			return s;
		default:
			return s + '.';
	}
}

export const response404 = { error: { status: '404', detail: 'Not found.' } };
export const response500 = { error: { status: '500', detail: 'Internal server error.' } };

export function headerBearerToken(v: string | null): string {
	if (!v) return '';

	return v.slice(7);
}

export function queryOrderBys(obs: string[]): OrderBy[] | undefined {
	if (obs.length == 0) return undefined;

	return obs.map((ob) => {
		const obs = ob.split(' ');
		const obr: OrderBy = { name: obs[0] };
		obs.forEach((oo) => {
			const kv = oo.split('=', 2);
			switch (kv[0].toLowerCase()) {
				case 'sort':
					obr.sort = kv[1];
					break;
				case 'null':
					obr.null = kv[1];
					break;
			}
		});

		return obr;
	});
}

export function formDataBigInt(v: FormDataEntryValue | null): bigint | undefined {
	if (v) return BigInt(v as string);
}

export function formDataBoolean(v: FormDataEntryValue | null): boolean | undefined {
	if (v) return Boolean(v);
}

export function formDataDate(v: FormDataEntryValue | null): Date | undefined {
	if (v) return new Date(v as string);
}

export function formDataNumber(v: FormDataEntryValue | null): number | undefined {
	if (v) return Number(v);
}
