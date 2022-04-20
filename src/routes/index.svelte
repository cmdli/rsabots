<script lang="ts">
	import { onMount } from 'svelte';
	import Bot from '$lib/bot.svelte';
	import { randomKey, randomString } from '$lib/util';
	import { downloadAssets } from '$lib/render';

	let downloadFunc = null;
	function download(type: string) {
		if (downloadFunc) {
			downloadFunc(type);
		}
	}

	function randomize() {
		randomKey().then((key) => {
			seed = key;
		});
	}

	let seed = '';
</script>

<div class="flex flex-col items-center w-full h-full">
	<div class="mt-24 flex flex-col items-center grow">
		<div class="w-[24rem] max-w-full space-y-4 flex flex-col items-center">
			<Bot
				{seed}
				registerDownload={(func) => {
					downloadFunc = func;
				}}
			/>
			<textarea
				bind:value={seed}
				class="textarea textarea-info w-full"
				placeholder="Enter public key, name, other data..."
			/>
			<div class="flex justify-center space-x-4">
				<button class="btn btn-primary" on:click={randomize}>Random</button>
				<div class="dropdown dropdown-top">
					<button class="btn btn-primary">
						Download
						<div class="arrow" />
					</button>
					<ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
						<li>
							<a
								on:click={() => {
									download('jpg');
								}}>JPEG</a
							>
						</li>
						<li>
							<a
								on:click={() => {
									download('png');
								}}>PNG</a
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="prose mt-36 w-[48rem] max-w-full">
			<h2 id="about" class="">How It Works</h2>
			<p class="">
				RSA Bots takes your name, public key, or whatever data you provide, and generates random
				bits with it using <a class="link" href="https://en.wikipedia.org/wiki/PBKDF2">PBKDF2</a>.
				Using these bits, it randomly selects arms, legs, torsos, heads, and other robotic parts to
				generate a unique robot for the data you provide. There are currently 2^35 possible robots,
				which is enough for everybody on the planet to have several bots to their name.
			</p>
			<p class="">
				Note: 35 bits of entropy isn't enough to be considered “cryptographically secure” on its
				own. It is entirely feasible to find collisions between the bots, so I wouldn't recommend
				using these bots for anything important. Or do. I'm a website, not a cop.
			</p>
			<h2 class="">License</h2>
			<p class="">
				These robot images are distributed under a
				<a class="link" href="https://creativecommons.org/licenses/by/4.0/"
					>Creative Commons License</a
				>
				(CC Attribution 4.0). The source code for this site is
				<a class="link" href="https://github.com/cmdli/rsabots/blob/master/LICENSE">MIT Licensed</a
				>.
			</p>
			<h2 class="">About Me</h2>
			<p class="mb-16">
				Hi, I'm Chris de la Iglesia. I'm a software engineer currently working on software solutions
				powered by cryptography, and I thought this would be a fun little side project in the
				meantime. See more at <a class="link" href="https://cmdli.dev">cmdli.dev</a>.
			</p>
		</div>
	</div>
</div>
<div class="mt-16">.</div>

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
