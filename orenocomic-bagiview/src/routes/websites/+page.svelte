<script lang="ts">
	import type { PageData } from './$types';
	import type { BCWebsite } from '$lib/api';
	import CardWebsite from '$components/CardWebsite.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;

	let websites: BCWebsite[] = [];

	let moreWebsites: BCWebsite[] = [];
	let pageWebsites: number = 1;
	async function loadWebsites() {
		moreWebsites = await data.websites(pageWebsites);
	}

	onMount(async () => {
		await loadWebsites();
	});

	$: websites = [...websites, ...moreWebsites];
</script>

<svelte:head>
	<title>Websites | BagiDono</title>
</svelte:head>

<div class="space-y-4 bg-white p-4">
	<h1 class="border-2 py-4 text-center text-2xl font-medium tracking-wider">WEBSITES</h1>
	<div class="flex flex-wrap justify-center gap-4 border p-4 max-md:px-0 max-md:py-2">
		{#if websites.length > 0}
			{#each websites as website}
				<CardWebsite {website} websiteThumbnail={data.websiteThumbnail}></CardWebsite>
			{/each}
		{/if}
	</div>
	{#if websites.length >= data.limitWebsites && moreWebsites?.length == data.limitWebsites}
		<button
			class="w-full border bg-slate-300 p-2"
			on:click={async () => {
				pageWebsites++;
				await loadWebsites();
			}}>Load More...</button
		>
	{/if}
</div>
