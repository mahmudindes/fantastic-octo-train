<script lang="ts">
	import type { PageData } from './$types';
	import type { DEComic } from '$lib/api';
	import CardComic from '$components/CardComic.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;

	let comics: DEComic[] = [];

	let pageComics: number = 1;
	let totalComic: number = 0;
	async function loadComics() {
		comics = [];
		comics = await data.comics(pageComics);
		totalComic = Number(data.otherComics['Total-Count']);
	}

	onMount(async () => {
		await loadComics();
	});
</script>

<svelte:head>
	<title>OrenoComic - Comic Catalog</title>
</svelte:head>

<div class="flex h-72 items-center justify-center bg-slate-700 text-white">
	<h1 class="text-center text-4xl font-medium">Comic Catalog</h1>
</div>
<div class="space-y-6 bg-white p-8 max-sm:p-4">
	{#if totalComic > 0}
		<div class="flex flex-wrap justify-center gap-4 py-2">
			{#each comics as comic}<CardComic {comic} />{/each}
		</div>
		<div class="p-2 text-center">
			<button
				class="border bg-slate-100 p-2 hover:bg-red-100"
				on:click={() => {
					if (pageComics > 1) {
						pageComics--;
						loadComics();
					}
				}}>Prev</button
			>
			<span class="mx-8">{pageComics}</span>
			<button
				class="border bg-slate-100 p-2 hover:bg-green-100"
				on:click={() => {
					if (pageComics * data.limitComics < totalComic) {
						pageComics++;
						loadComics();
					}
				}}>Next</button
			>
		</div>
	{/if}
</div>
