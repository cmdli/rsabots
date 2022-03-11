<script lang="ts">
	import { rootPattern } from '$lib/parts';
	import Part from '$lib/part.svelte';
	const rootPart = rootPattern.resolve();
</script>

<div class="container" aria-hidden={true}>
	<Part part={rootPart} zIndex={100} x={30} y={30} />
</div>

<style>
	.container {
		display: block;
		position: relative;
		width: 200px;
		height: 200px;
	}
</style>
