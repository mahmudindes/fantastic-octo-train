<script lang="ts">
	import type { BCWebsite } from '$lib/api';
	import { onMount } from 'svelte';
	import loadingAnimation from '$assets/loadingAnimation.gif';

	export let website: BCWebsite;
	export let websiteThumbnail: (website: BCWebsite) => Promise<string>;

	let thumbnail: string = loadingAnimation;
	onMount(async () => {
		thumbnail = await websiteThumbnail(website);
	});
</script>

<a class="mb-2 block space-y-1" target="_blank" href="//{website.domain}" rel="noreferrer nofollow">
	<div class="card-image border max-sm:h-28 max-sm:w-48 sm:h-44 sm:w-80">
		<img
			class:card-image-loaded={thumbnail != loadingAnimation}
			src={thumbnail}
			alt="{website.name} Thumbnail"
		/>
	</div>
	<span class="card-title block text-center font-medium max-sm:w-48 sm:w-80">{website.name}</span>
</a>
