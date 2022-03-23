<script lang="ts">
	import { rootPattern } from '$lib/parts';
	import { Random } from './random';
	import CanvasBot from './canvas-bot.svelte';

	export let seed: string = 'test';
	export let registerDownload: (func: () => void) => void;

	async function generateBot(seed: string) {
		const rng = new Random();
		await rng.seed(seed);
		return rootPattern.resolve(rng);
	}
	let botPromise;
	$: botPromise = generateBot(seed);
</script>

<div class="container" aria-hidden={true}>
	{#await botPromise then rootPart}
		<CanvasBot part={rootPart} {registerDownload} />
	{/await}
</div>

<style>
	.container {
		display: block;
		position: relative;
		width: 900px;
		height: 600px;
	}
</style>
