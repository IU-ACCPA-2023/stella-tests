<script lang="ts">
	import { RadioGroup, RadioItem, FileDropzone } from '@skeletonlabs/skeleton';
	import { features, type Feature } from './languageFeatures';
	import CheckIcon from '~icons/fa/check';
	import ThumbsUp from '~icons/fa/thumbs-up';
	import ThumbsDown from '~icons/fa/thumbs-down';

	let choices = Object.fromEntries(features.map((feat) => [feat, false])) as Record<
		Feature,
		boolean
	>;
	let wellTyped = true;
	let files: FileList | undefined;

	function triggerChoice(f: Feature) {
		choices[f] = !choices[f];
	}
</script>

<form class="flex flex-col items-center justify-evenly h-full">
	<FileDropzone name="file" bind:files accept=".stella" multiple />

	{#if files}
		<ol class="list text-token card p-4 space-y-1">
			{#each files as file, i}
				<li>
					<span class="badge-icon p-4 variant-soft-primary">{i + 1}</span>
					<span class="flex-auto">{file.name}</span>
				</li>
			{/each}
		</ol>
	{/if}

	<div class="space-y-2">
		<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
			<RadioItem bind:group={wellTyped} name="typing" value={true}>
				<ThumbsUp color="blue" class="inline mr-1" />
				Well-typed
			</RadioItem>
			<RadioItem bind:group={wellTyped} name="typing" value={false}>
				<ThumbsDown color="red" class="inline mr-1" />
				Ill-typed
			</RadioItem>
		</RadioGroup>
	</div>

	<div class="flex flex-wrap justify-center gap-2">
		{#each features as f (f)}
			<span
				class="chip variant-{choices[f] ? 'filled' : 'soft'}"
				on:click={() => triggerChoice(f)}
				on:keypress
			>
				{#if choices[f]}<CheckIcon />{/if}
				<span class="capitalize">{f}</span>
			</span>
		{/each}
	</div>

	<button type="submit" class="btn variant-filled">Submit</button>
</form>
