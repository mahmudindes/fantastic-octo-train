<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex h-96 items-center justify-center border bg-white">
	<h1 class="text-2xl">
		<span class="font-bold">{$page.status}</span>: {$page.error?.message}
	</h1>
</div>
