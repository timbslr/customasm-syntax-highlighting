import * as vscode from "vscode";

export function matchRegex(regExp, document, documentText) {
	const matchingRanges = [];
	let match;
	while ((match = regExp.exec(documentText))) {
		const start = document.positionAt(match.index);
		const end = document.positionAt(match.index + match[0].length);
		matchingRanges.push(new vscode.Range(start, end));
	}
	return matchingRanges;
}
