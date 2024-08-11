<script lang="ts">
	import '../app.css';
	import Header from '$components/Header.svelte';

	const siteName: string = 'OrenoComic';
	const navigationLinks: Map<string, string> = new Map();
	const searchAction: string = '';

	navigationLinks.set('/', 'Home');
	navigationLinks.set('/comics', 'Comics');
	navigationLinks.set('//github.com/mahmudindes', 'GitHub');
</script>

<div class="container mx-auto flex min-h-screen flex-col bg-white">
	<Header {siteName} {navigationLinks} {searchAction} />
	<main class="flex-1 bg-slate-50">
		<slot />
	</main>
	<footer class="flex flex-col bg-gray-800 py-2 text-white">
		<span class="self-center">Copyright 2024</span>
	</footer>
</div>
