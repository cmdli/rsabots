<script lang="ts">
	import { onMount } from 'svelte';
	import type { PartData } from './parts';
	import { renderPart, BOT_SCALE, downloadAsImage, renderDebugOverlay } from './render';

	export let part: PartData;
	export let registerDownload: (func: () => void) => void;

	onMount(() => {
		const canvas = document.getElementById('canvas-bot') as HTMLCanvasElement;
		canvas.width *= BOT_SCALE;
		canvas.height *= BOT_SCALE;
		const context = canvas.getContext('2d');
		renderPart(context, part, 0, 0).then(() => {
			//renderDebugOverlay(context, part, 0, 0);
		});
	});

	function download() {
		const canvas = document.getElementById('canvas-bot') as HTMLCanvasElement;
		downloadAsImage(canvas, 'bot.png');
	}
	if (registerDownload) {
		registerDownload(download);
	}
</script>

<canvas id="canvas-bot" class="canvas-bot" width="525" height="350" />

<style>
	.canvas-bot {
		position: absolute;
		width: 900px;
		height: 600px;
	}
</style>
