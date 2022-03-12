<script lang="ts">
	import { rootPattern } from '$lib/parts';
	import Part from '$lib/part.svelte';
	const rootPart = rootPattern.resolve();
</script>

<div class="container" aria-hidden={true}>
	<Part part={rootPart} zIndex={100} x={0} y={0} debug={true} />
</div>

<style>
	.container {
		display: block;
		position: relative;
		width: 400px;
		height: 400px;
	}
</style>
