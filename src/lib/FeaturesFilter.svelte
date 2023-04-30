<script lang="ts">
	import {
		Autocomplete,
		InputChip,
		RadioGroup,
		RadioItem,
		type PopupSettings,
		popup,
		storePopup,
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { type Feature, features } from './languageFeatures';
	import CheckVerifiedIcon from '~icons/fe/check-verified';
	import BugIcon from '~icons/fe/bug';
	import DownloadIcon from '~icons/fe/download';
	import { createEventDispatcher } from 'svelte';

	export let wellTypedFilter: boolean | null = null;
	export let includedTags: Feature[] = [];
	let input = '';

	const dispatch = createEventDispatcher<{
		download: { wellTypedFilter: boolean | null; includedTags: Feature[] };
	}>();

	const inputOptions = features.map((f) => ({
		label: f,
		value: f,
	}));

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const popupSettings: PopupSettings = {
		event: 'focus',
		target: 'popupAutocomplete',
		placement: 'bottom',
	};

	function onInputChipSelect(event: CustomEvent<{ label: Feature; value: Feature }>): void {
		if (!includedTags.includes(event.detail.value)) {
			includedTags = [...includedTags, event.detail.value];
			input = '';
		}
	}

	function triggerDownload() {
		dispatch('download', {
			includedTags,
			wellTypedFilter,
		});
	}
</script>

<section class="w-full flex gap-2 my-4">
	<div class="-mt-[10px]">
		<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
			<RadioItem bind:group={wellTypedFilter} name="typing" value={true}>
				<CheckVerifiedIcon color="green" class="inline mr-1" />
				Well-typed
			</RadioItem>
			<RadioItem bind:group={wellTypedFilter} name="typing" value={false}>
				<BugIcon color="red" class="inline mr-1" />
				Ill-typed
			</RadioItem>
			{#if wellTypedFilter != null}
				<button class="btn btn-sm" on:click={() => (wellTypedFilter = null)}>Clear</button>
			{/if}
		</RadioGroup>
	</div>

	<div use:popup={popupSettings} class="flex-grow">
		<InputChip
			bind:input
			bind:value={includedTags}
			name="chips"
			placeholder="Choose language features"
		/>
	</div>

	<div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" data-popup="popupAutocomplete">
		<Autocomplete
			bind:input
			options={inputOptions}
			denylist={includedTags}
			on:selection={onInputChipSelect}
		/>
	</div>

	<button class="btn variant-filled-primary" on:click={triggerDownload}>
		<span><DownloadIcon /></span>
		<span>Download All</span>
	</button>
</section>
