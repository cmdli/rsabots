<script>
	import Layout from './__layout.svelte';
</script>

<svelte:head>
	<title>Test</title>
</svelte:head>

<div class="flex flex-col items-center w-full h-full">
	<div class="mt-96 flex flex-col items-center max-w-[48rem] w-[48rem] grow">
		<div class="max-w-[24rem] space-y-4 flex flex-col align-center">
			<div>Robot</div>
			<textarea class="textarea textarea-info" placeholder="Enter Public Key..." />
			<div class="flex justify-center space-x-4">
				<div class="btn btn-primary">Random</div>
				<div class="dropdown">
					<button class="btn btn-primary">Download</button>
					<ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
						<li><a href="/">SVG</a></li>
						<li><a href="/">PNG</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="mt-4 grow">
			<h2 class="mb-0 text-4xl">How It Works</h2>
			<p class="mt-0">Lorem ipsum</p>
		</div>
	</div>
</div>
