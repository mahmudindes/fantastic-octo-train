<script lang="ts">
	import type { PageData } from './$types';
	import type { DEComicChapter, DEWebsite } from '$lib/api';
	import { getComicCover, getComicSynopsis, getComicTitle } from '$lib/helper';
	import loadingAnimation from '$assets/loadingAnimation.gif';
	import { onMount } from 'svelte';

	export let data: PageData;

	$: comic = data.comic;
	let cover: string = loadingAnimation;
	let title: string = 'Loading Title...';
	let synopsis: string = 'Loading descriptions...';
	let websites = new Map<string, DEWebsite>();

	async function load() {
		cover = getComicCover(comic);
		title = getComicTitle(comic, 'en');
		synopsis = getComicSynopsis(comic, 'en');

		comic.externals?.forEach(async (external) => {
			if (websites.has(external.websiteDomain)) {
				return;
			}
			const website = await data.website(external.websiteDomain);
			websites = websites.set(external.websiteDomain, website);
		});
	}

	let openedChapter = new Map<number, boolean>();

	let loadedCount: number = 0;
	$: if (comic != null) {
		if (loadedCount > 2) {
			cover = loadingAnimation;
			title = 'Loading Title...';
			synopsis = 'Loading descriptions...';
			load();

			openedChapter = new Map<number, boolean>();
		}

		loadedCount += 1;
	}

	onMount(async () => {
		await load();

		loadedCount += 1;
	});

	function chapterName(chapter: DEComicChapter): string {
		let name = chapter.chapter;
		if (chapter.version) {
			name += ' (' + chapter.version + ')';
		}
		return name;
	}

	function handleChapter(id: number): () => void {
		return function () {
			openedChapter = openedChapter.set(id, !openedChapter.get(id) ?? true);
		};
	}
</script>

<svelte:head>
	<title>{title} | BagiDono</title>
</svelte:head>

<div class="w-full space-y-4">
	<div class="flex w-full max-md:flex-col max-md:items-center max-md:space-y-4 md:space-x-4">
		<a target="_blank" href={cover} rel="noreferrer nofollow" class="h-96">
			<div class="card-image h-full w-64 border bg-white">
				<img class:card-image-loaded={cover != loadingAnimation} src={cover} alt="{title} Cover" />
			</div>
		</a>
		<div class="h-96 flex-1 space-y-2 border bg-white p-4 max-md:w-full">
			<h1 class="border-b pb-1 text-lg font-medium max-md:text-center">{title}</h1>
			<span class="line-clamp-[12] whitespace-pre-line">{synopsis}</span>
		</div>
	</div>
	{#if comic.externals}
		<div class="border bg-white p-4">
			<h2 class="border-b pb-2 text-center text-lg">Externals</h2>
			<div class="grid grid-cols-2 border">
				{#each comic.externals as external}
					{@const website = websites.get(external.websiteDomain)}
					<a
						target="_blank"
						href={'//' + external.websiteDomain}
						rel="noreferrer nofollow"
						class="block border p-2 visited:text-blue-800 hover:underline"
					>
						<span class="block">{website?.name ?? 'Loading...'}</span>
					</a>
				{/each}
			</div>
		</div>
	{/if}
	{#if comic.chapters}
		<div class="border bg-white p-4">
			<h2 class="border-b pb-2 text-center text-lg">Chapters</h2>
			<div class="grid grid-cols-2 border">
				{#each comic.chapters as chapter}
					<div class="border">
						<span>Chapter {chapterName(chapter)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
