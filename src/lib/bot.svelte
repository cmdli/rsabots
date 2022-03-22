<script lang="ts">
	import { rootPattern } from '$lib/parts';
	import Part from '$lib/part.svelte';
	import DebugOverlay from './debug-overlay.svelte';
	import { Random } from './random';
	import CanvasBot from './canvas-bot.svelte';

	export let seed: string = 'test';
	export let useCanvas: boolean = true;
	export let registerDownload: (func: () => void) => void;

	async function generateBot(seed: string) {
		const rng = new Random();
		await rng.seed(seed);
		return rootPattern.resolve(rng);
	}
	let botPromise;
	$: botPromise = generateBot(seed);
</script>

{#await botPromise then rootPart}
	<div class="container" aria-hidden={true}>
		{#if !useCanvas}
			<div class="bot">
				<DebugOverlay part={rootPart} x={0} y={0} />
				<Part part={rootPart} zIndex={100} x={0} y={0} debug={false} />
			</div>
		{:else}
			<CanvasBot part={rootPart} {registerDownload} />
		{/if}
	</div>
{/await}

<style>
	.container {
		display: block;
		position: relative;
		width: 900px;
		height: 600px;
	}
	.bot {
		position: absolute;
		width: 600px;
		height: 400px;
		left: 100px;
		top: 100px;
		transform: scale(1.5);
	}
</style>
