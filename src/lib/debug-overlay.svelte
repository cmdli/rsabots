<script lang="ts">
	import type { PartData, Anchor } from './parts';
	import { makeStyle } from './util';
	import DebugOverlay from './debug-overlay.svelte';

	export let part: PartData;
	export let x: number;
	export let y: number;

	function anchorStyle(anchor: Anchor): string {
		return makeStyle({
			left: `${anchor.x * part.width - 2}px`,
			top: `${anchor.y * part.height - 2}px`
		});
	}

	let anchors = part.anchors;
	let socketX = Math.floor(part.socket.x * part.width);
	let socketY = Math.floor(part.socket.y * part.height);
	let style = makeStyle({
		left: `${x - socketX}px`,
		top: `${y - socketY}px`,
		width: part.width + 'px',
		height: part.height + 'px'
	});
</script>

<div class="overlay" {style}>
	{#each anchors as [anchor, partData]}
		<div style={anchorStyle(anchor)} class="anchor" />
		<DebugOverlay x={anchor.x * part.width} y={anchor.y * part.height} part={partData} />
	{/each}
</div>

<style>
	.overlay {
		z-index: 200;
		position: absolute;
	}
	.anchor {
		width: 4px;
		height: 4px;
		z-index: 202;
		background-color: red;
		position: absolute;
	}
</style>
