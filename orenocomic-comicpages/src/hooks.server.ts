import { error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	csrf(event.request, event.url);

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

function csrf(request: Request, url: URL): void {
	const h = request.headers;

	const csrfType = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'];
	if (!csrfType.includes(h.get('Content-Type')?.split(';', 1)[0].toLowerCase() ?? '')) return;

	const csrfMethod = ['POST', 'PUT', 'PATCH', 'DELETE'];
	if (!csrfMethod.includes(request.method)) return;

	const csrfOrigin = [url.origin];
	if (csrfOrigin.includes(h.get('Origin') ?? '')) return;

	// if (url.pathname.startsWith('/api')) return;

	error(403, `Cross-site ${request.method} form submissions are forbidden`);
}
