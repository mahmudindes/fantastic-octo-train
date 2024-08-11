import type { PageLoad } from './$types';
import type { BCWebsite } from '$lib/api';
import { getWebsites } from '$lib/helper';

export const load: PageLoad = async ({ fetch }) => {
	const limitWebsites = 24;
	const websites = function (page: number): Promise<BCWebsite[]> {
		return getWebsites(fetch, page, limitWebsites, [{ name: 'domain', sort: 'asc' }]);
	};

	return { websites, limitWebsites };
};
