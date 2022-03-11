<script lang="ts">
	import type { PartData } from '$lib/parts';
	import Part from '$lib/part.svelte';
	export let part: PartData;
	export let x: number;
	export let y: number;
	export let zIndex: number;
	let imgSrc = part.imagePath ? '/botparts/' + part.imagePath : null;
	let style =
		'left:' +
		x +
		'px;top:' +
		y +
		'px;z-index:' +
		zIndex +
		';width:' +
		part.width +
		'px;height:' +
		part.height +
		'px';
	let anchors = part.anchors;
</script>

<div class="part" {style}>
	{#if imgSrc !== null}
		<img src={imgSrc} />
	{/if}
	{#each anchors as anchor}
		<Part x={anchor[0][0]} y={anchor[0][1]} part={anchor[1]} zIndex={zIndex + 1} />
	{/each}
</div>

<style>
	.part {
		display: block;
		position: absolute;
	}
</style>
