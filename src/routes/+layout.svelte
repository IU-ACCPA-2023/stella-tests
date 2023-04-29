<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { supabase } from '$lib/supabase';
	import { user, trackAuthStatus } from '$lib/user';
	import { onMount } from 'svelte';

	async function signIn() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
		});
		if (error) {
			alert('Error ' + error.name + ': ' + error.message);
		}
	}

	onMount(trackAuthStatus);
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Stella Tests</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $user == null}
					<button class="btn" on:click={signIn}>Sign in</button>
				{:else}
					<p>@{$user.user_metadata.user_name}</p>
				{/if}
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/IU-ACCPA-2023/stella-tests"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
