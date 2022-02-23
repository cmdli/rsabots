<script>
	import '../app.css';
</script>

<svelte:head>
	<title>RSABots</title>
</svelte:head>

<div class="flex flex-col w-full h-full">
	<div class="navbar bg-base-100 flex justify-between items-center space-x-4">
		<h1 class="h">RSABots</h1>
		<a class="btn" href="/about">About</a>
	</div>

	<slot />
</div>
