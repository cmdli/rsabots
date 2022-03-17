<script lang="ts">
	import { rootPattern } from '$lib/parts';
	import Part from '$lib/part.svelte';
	import DebugOverlay from './debug-overlay.svelte';
	const rootPart = rootPattern.resolve();
</script>

<div class="container" aria-hidden={true}>
	<DebugOverlay part={rootPart} x={0} y={0} />
	<Part part={rootPart} zIndex={100} x={0} y={0} debug={false} />
</div>

<style>
	.container {
		display: block;
		position: relative;
		width: 400px;
		height: 400px;
		transform: scale(1.5);
	}
</style>
