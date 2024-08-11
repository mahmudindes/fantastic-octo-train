<script lang="ts">
	import type { PageData } from './$types';
	import type { BCComicChapter, BCWebsite } from '$lib/api';
	import { getComicCover, getComicSynopsis, getComicTitle } from '$lib/helper';
	import loadingAnimation from '$assets/loadingAnimation.gif';
	import { onMount } from 'svelte';

	export let data: PageData;

	$: comic = data.comic;
	let cover: string = loadingAnimation;
	let title: string = 'Loading Title...';
	let synopsis: string = 'Loading descriptions...';
	let websites = new Map<string, BCWebsite>();

	async function load() {
		const comicData = await data.comicData(comic.code);
		cover = getComicCover(comicData);
		title = getComicTitle(comicData, 'en');
		synopsis = getComicSynopsis(comicData, 'en');

		comic.links?.forEach(async (link) => {
			if (websites.has(link.websiteDomain)) {
				return;
			}
			const website = await data.website(link.websiteDomain);
			websites = websites.set(link.websiteDomain, website);
		});
		comic.chapters?.forEach(async (chapter) => {
			chapter.links?.forEach(async (link) => {
				if (websites.has(link.websiteDomain)) {
					return;
				}
				const website = await data.website(link.websiteDomain);
				websites = websites.set(link.websiteDomain, website);
			});
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

	function chapterName(chapter: BCComicChapter): string {
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
	{#if comic.links}
		<div class="border bg-white p-4">
			<h2 class="border-b pb-2 text-center text-lg">Websites</h2>
			<div class="grid grid-cols-2 border">
				{#each comic.links as link}
					{@const website = websites.get(link.websiteDomain)}
					<a
						target="_blank"
						href={'//' + link.websiteDomain}
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
						<button
							class:cursor-default={!chapter.links}
							class="w-full p-2"
							on:click={handleChapter(chapter.id)}
						>
							<span class:text-green-500={chapter.links}>Chapter {chapterName(chapter)}</span>
						</button>
						{#if openedChapter.get(chapter.id) && chapter.links}
							<div class="border-t md:grid md:grid-cols-2">
								{#each chapter.links as link}
									{@const website = websites.get(link.websiteDomain)}
									<a
										target="_blank"
										href={'//' + link.websiteDomain + link.relativeURL}
										rel="noreferrer nofollow"
										class="block border p-2 visited:text-blue-800 hover:underline"
									>
										<span class="block">{website?.name ?? 'Loading...'}</span>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
