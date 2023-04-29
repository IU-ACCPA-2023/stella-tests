<script lang="ts">
	import NewTestForm from '$lib/NewTestForm.svelte';
	import { user } from '$lib/user';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	{#if $user != null}
		<NewTestForm />
	{/if}
</div>

<style lang="postcss">
</style>
