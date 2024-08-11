import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
			platformProxy: {
				persist: undefined
			}
		}),

		alias: {
			$assets: './src/assets',
			$components: './src/components'
		},

		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
