import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => {
			if (name == 'content-length') {
				return true;
			}
			if (name.startsWith('x-')) {
				return true;
			}
			return false;
		}
	});

	return response;
};
