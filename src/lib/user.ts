import type { User } from '@supabase/supabase-js';
import { writable, type Writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

export let user: Writable<User | null> = writable(null);

export function trackAuthStatus() {
	const { data } = supabase.auth.onAuthStateChange((_event, session) => {
		user.set(session?.user ?? null);
	});

	return data.subscription.unsubscribe;
}
