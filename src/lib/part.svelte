<script lang="ts">
	import type { PartData, Anchor } from '$lib/parts';
	import Part from '$lib/part.svelte';
	import { makeStyle, makeClass } from '$lib/util';

	export let part: PartData;
	export let x: number;
	export let y: number;
	export let zIndex: number;
	export let debug: boolean = false;

	function anchorStyle(anchor: Anchor): string {
		return makeStyle({ left: `${anchor.x - 2}px`, top: `${anchor.y - 2}px` });
	}

	let imgSrc = part.imagePath ? '/botparts/' + part.imagePath : null;
	let socketX = Math.floor(part.socket.x * part.width);
	let socketY = Math.floor(part.socket.y * part.height);
	let socketStyle = makeStyle({ left: `${socketX - 2}px`, top: `${socketY - 2}px` });
	let style = makeStyle({
		left: `${x - socketX}px`,
		top: `${y - socketY}px`,
		'z-index': zIndex,
		width: part.width + 'px',
		height: part.height + 'px'
	});
	let imgStyle = makeStyle({
		left: '0',
		top: '0',
		'z-index': zIndex,
		width: part.width + 'px',
		height: part.height + 'px'
	});
	let classList = makeClass('part', { flipX: part.flipX, flipY: part.flipY });
	let anchors = part.anchors;
</script>

<div class={classList} {style}>
	{#if imgSrc !== null}
		{#if debug}<div style={socketStyle} class="socket" />{/if}
		<img src={imgSrc} style={imgStyle} class="part-image" aria-hidden="true" alt="Bot Part" />
	{/if}
	{#each anchors as [anchor, partData]}
		{#if debug}<div style={anchorStyle(anchor)} class="anchor" />{/if}
		<Part
			x={anchor.x * part.width}
			y={anchor.y * part.height}
			part={partData}
			zIndex={zIndex + anchor.zDelta}
			{debug}
		/>
	{/each}
</div>

<style>
	.part {
		display: block;
		position: absolute;
	}
	.part-image {
		position: absolute;
	}
	.anchor {
		width: 4px;
		height: 4px;
		z-index: 202;
		background-color: red;
		position: absolute;
	}
	.socket {
		width: 4px;
		height: 4px;
		z-index: 201;
		background-color: blue;
		position: absolute;
	}
	.flipX {
		transform: scaleX(-1);
	}
	.flipY {
		transform: scaleY(-1);
	}
</style>
