export const features = [
	'unit',
	'pairs',
	'sum-types',
	'let-bindings',
	'variants',
	'tuples',
	'records',
	'structural-patterns',
	'recursion',
	'sequences',
	'references',
	'errors',
	'subtyping',
] as const;

export type Feature = (typeof features)[number];
