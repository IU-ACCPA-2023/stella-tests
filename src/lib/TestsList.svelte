<script lang="ts">
	import { onMount } from 'svelte';
	import JSZip from 'jszip';
	import { supabase } from './supabase';
	import type { Database } from './supabaseTypes';
	import DownloadIcon from '~icons/fe/download';
	import TrashIcon from '~icons/fe/trash';
	import ExternalLinkIcon from '~icons/fe/link-external';
	import type { Feature } from './languageFeatures';
	import FeaturesFilter from './FeaturesFilter.svelte';
	import { notNull, saveAs } from './utils';
	import { user } from './user';

	type Test = Database['public']['Tables']['tests']['Row'];

	let tests: Test[] = [];
	let wellTypedFilter: boolean | null = null;
	let includedTags: Feature[] = [];
	$: filteredTests = tests.filter(
		(test) =>
			(wellTypedFilter == null || wellTypedFilter === test.well_typed) &&
			includedTags.every((tag) => test.tags.includes(tag))
	);

	onMount(async () => {
		const { data, error } = await supabase.from('tests').select('*');
		if (error) {
			alert('An error occured fetching data: ' + error.message);
			return;
		}
		tests = data;
		const channel = supabase
			.channel('tests-changes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'tests',
				},
				(payload) => {
					tests = [...tests, payload.new as Test];
				}
			)
			.subscribe();
		return channel.unsubscribe;
	});

	function getUrl(test: Test) {
		const { data } = supabase.storage.from('tests').getPublicUrl(test.file_path);
		return data.publicUrl;
	}

	function downloadTest(test: Test) {
		const a = document.createElement('a');
		a.href = getUrl(test);
		a.style.display = 'none';
		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	async function deleteTest(test: Test) {
		if (!confirm('Are you sure you want to delete this test?')) {
			return;
		}
		const { error: fileError } = await supabase.storage.from('tests').remove([test.file_path]);
		if (fileError) {
			alert('Error deleting file: ' + fileError.message);
			return;
		}
		const { error: dbError } = await supabase.from('tests').delete().eq('id', test.id);
		if (dbError) {
			alert('Error removing row from DB: ' + dbError.message);
			return;
		}
		tests = tests.filter((t) => t.id != test.id);
	}

	async function downloadAll() {
		const results = await Promise.all(
			filteredTests.map(async (test) => ({
				name: test.file_path,
				content: await supabase.storage.from('tests').download(test.file_path),
			}))
		);
		const errors = results.map((res) => res.content.error).filter(notNull);
		if (errors.length > 0) {
			errors.forEach(console.error);
			alert('An error occured. Please check the console');
			return;
		}
		const zip = new JSZip();
		results.forEach(({ name, content: { data } }) => {
			zip.file(name, data!);
		});
		const content = await zip.generateAsync({ type: 'blob' });
		const typingPrefix = wellTypedFilter == null ? '' : wellTypedFilter === true ? 'well-' : 'ill-';
		const tags = includedTags.length === 0 ? '' : includedTags.join(',') + '-';
		const fileName = typingPrefix + tags + 'tests.zip';
		saveAs(fileName, content as Blob);
	}
</script>

<div class="table-container mb-20 mt-5">
	<h1>Filters</h1>
	<FeaturesFilter bind:wellTypedFilter bind:includedTags on:download={downloadAll} />
	<table class="table table-hover table-compact">
		<thead>
			<tr>
				<th>Name</th>
				<th>Tags</th>
				<th>Description</th>
				<th>Added at</th>
				<th><!-- Actions --></th>
			</tr>
		</thead>
		<tbody>
			{#each filteredTests as test}
				<tr>
					<td>{test.name}</td>
					<td class="flex flex-wrap gap-1">
						{#if test.well_typed}
							<span class="chip variant-filled-success">Well-typed</span>
						{:else}
							<span class="chip variant-filled-error">Ill-typed</span>
						{/if}
						{#each test.tags as tag}
							<span class="chip variant-filled">{tag}</span>
						{/each}
					</td>
					<td>{test.description}</td>
					<td>{new Date(test.created_at).toLocaleString()}</td>
					<td>
						<a
							class="btn btn-icon h-5"
							title="Open in the playground"
							target="_blank"
							href={`https://fizruk.github.io/stella/interpreter/?snippet_url=${getUrl(test)}`}
						>
							<ExternalLinkIcon class="mr-2" />
						</a>
						<button class="btn btn-icon h-5" on:click={() => downloadTest(test)}>
							<DownloadIcon class="mr-2" />
						</button>
						{#if $user?.id == test.created_by}
							<button class="btn btn-icon h-5" on:click={() => deleteTest(test)}>
								<TrashIcon color="red" />
							</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
