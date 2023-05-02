<script lang="ts">
	import NewTestForm from '$lib/NewTestForm.svelte';
	import TestsList from '$lib/TestsList.svelte';
	import { user } from '$lib/user';
</script>

<svelte:head>
	<title>Stella Tests</title>
</svelte:head>

<div class="container h-full mx-auto justify-center items-center w-[80%]">
	{#if $user != null}
		<NewTestForm />
	{/if}
	<TestsList />
</div>

<style lang="postcss">
</style>
