/**
 * Useful for usage with `.filter` because CFA is not smart enough
 */
export function notNull<T>(arg: T | null): arg is T {
	return arg != null;
}

export function saveAs(filename: string, content: Blob) {
	const a = document.createElement('a');
	a.href = window.URL.createObjectURL(content);
	a.download = filename;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	a.remove();
}
