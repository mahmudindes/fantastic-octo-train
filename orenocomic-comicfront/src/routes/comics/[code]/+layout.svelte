<script lang="ts">
	import type { PageData } from './$types';
	import type { DEComic } from '$lib/api';
	import { getComicTitle } from '$lib/helper';
	import { onMount } from 'svelte';

	export let data: PageData;

	let comics: DEComic[];
	let comicsTitle = new Map<string, string>();
	onMount(async () => {
		comics = await data.newComics;
		comics.forEach(async (comic) => {
			if (comicsTitle.has(comic.code)) {
				return;
			}
			comicsTitle = comicsTitle.set(comic.code, getComicTitle(comic, 'en'));
		});
	});
</script>

<div class="flex p-4 max-lg:flex-col max-lg:items-center max-lg:space-y-4 lg:space-x-4">
	<div class="w-full flex-1">
		<slot />
	</div>
	<div class="w-80 space-y-4 max-md:w-full">
		<div class="border bg-white p-4">
			<h3 class="border-b pb-2 font-medium">New Comics</h3>
			{#if comics?.length > 0}
				<div class="space-y-1 py-1">
					{#each comics as comic}
						<a
							class="block border p-2 visited:text-blue-800 hover:underline"
							href="/comics/{comic.code}"
						>
							<span>{comicsTitle.get(comic.code) ?? 'Loading...'}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
