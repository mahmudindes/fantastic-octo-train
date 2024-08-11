<script lang="ts">
	import type { PageData } from './$types';
	import type { DEComic } from '$lib/api';
	import CardComic from '$components/CardComic.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;

	let comics: DEComic[] = [];

	let moreComics: DEComic[] = [];
	let pageComics: number = 1;
	async function loadComics() {
		moreComics = await data.comics(pageComics);
	}

	onMount(async () => {
		await loadComics();
	});

	$: comics = [...comics, ...moreComics];
</script>

<svelte:head>
	<title>Comics | BagiDono</title>
</svelte:head>

<div class="space-y-4 bg-white p-4">
	<h1 class="border-2 py-4 text-center text-2xl font-medium tracking-wider">COMICS</h1>
	<div class="flex flex-wrap justify-center gap-4 border p-4 max-md:px-0 max-md:py-2">
		{#if comics.length > 0}
			{#each comics as comic}<CardComic {comic} />{/each}
		{/if}
	</div>
	{#if comics.length >= data.limitComics && moreComics?.length == data.limitComics}
		<button
			class="w-full border bg-slate-300 p-2"
			on:click={async () => {
				pageComics++;
				await loadComics();
			}}>Load More...</button
		>
	{/if}
</div>
