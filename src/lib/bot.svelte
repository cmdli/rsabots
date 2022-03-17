<script lang="ts">
	import { rootPattern } from '$lib/parts';
	import Part from '$lib/part.svelte';
	import DebugOverlay from './debug-overlay.svelte';
	import { Random } from './random';

	export let seed: string = 'test';

	async function generateBot(seed: string) {
		const rng = new Random();
		await rng.seed(seed);
		return rootPattern.resolve(rng);
	}
	let botPromise;
	$: botPromise = generateBot(seed);
</script>

<div class="container" aria-hidden={true}>
	<div class="bot">
		{#await botPromise then rootPart}
			<DebugOverlay part={rootPart} x={0} y={0} />
			<Part part={rootPart} zIndex={100} x={0} y={0} debug={false} />
		{/await}
	</div>
</div>

<style>
	.container {
		display: block;
		position: relative;
		width: 600px;
		height: 600px;
	}
	.bot {
		width: 400px;
		height: 400px;
		transform: scale(1.5);
	}
</style>
