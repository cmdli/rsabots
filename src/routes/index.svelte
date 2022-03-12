<script lang="ts">
	import Bot from '$lib/bot.svelte';
</script>

<div class="flex flex-col items-center w-full h-full">
	<div class="mt-24 flex flex-col items-center grow">
		<div class="w-[24rem] max-w-full space-y-4 flex flex-col items-center">
			<Bot />
			<textarea class="textarea textarea-info w-full" placeholder="Enter Public Key..." />
			<div class="flex justify-center space-x-4">
				<div class="btn btn-primary">Random</div>
				<div class="dropdown">
					<button class="btn btn-primary"
						>Download
						<div class="arrow" /></button
					>
					<ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
						<li><a href="/">SVG</a></li>
						<li><a href="/">PNG</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="mt-36 w-[36rem] max-w-full">
			<h2 class="mb-0 text-4xl">How It Works</h2>
			<p class="mt-0">Lorem ipsum</p>
		</div>
	</div>
</div>

<style>
	.arrow {
		height: 0.5rem;
		width: 0.5rem;
		content: '';
		transform-origin: 75% 75%;
		transform: rotate(45deg) translateY(-0.3rem);
		box-shadow: 2px 2px;
		pointer-events: none;
		box-sizing: border-box;
		border-width: 0;
		border-style: solid;
		border-color: #e5e7eb;
	}
</style>
