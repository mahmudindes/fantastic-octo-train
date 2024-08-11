<script lang="ts">
	import type { DEComic } from '$lib/api';
	import { onMount } from 'svelte';
	import { getComicCover, getComicTitle } from '$lib/helper';
	import loadingAnimation from '$assets/loadingAnimation.gif';

	export let comic: DEComic;

	let cover: string = loadingAnimation;
	let title: string = 'Loading Title...';
	onMount(async () => {
		cover = getComicCover(comic);
		title = getComicTitle(comic, 'en');
	});
</script>

<a class="mb-2 block space-y-1" href="/comics/{comic.code}">
	<div class="card-image border max-sm:h-48 max-sm:w-32 sm:h-72 sm:w-48">
		<img class:card-image-loaded={cover != loadingAnimation} src={cover} alt="{title} Cover" />
	</div>
	<span class="card-title block border-b-2 font-medium max-sm:w-32 sm:w-48">{title}</span>
</a>
