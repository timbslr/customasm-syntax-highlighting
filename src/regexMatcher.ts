import * as vscode from "vscode";

/**
 *
 * @param regExp The regular expression that the input should me matched against
 * @param  document The document that should be checked
 * @returns The ranges in the document that matched the regular expression
 */
export function matchRegex(regExp: RegExp, document: vscode.TextDocument): vscode.Range[] {
	const documentText = document.getText();
	const matchingRanges = [];
	let match;

	while ((match = regExp.exec(documentText))) {
		const start = document.positionAt(match.index);
		const end = document.positionAt(match.index + match[0].length);
		matchingRanges.push(new vscode.Range(start, end));
	}

	return matchingRanges;
}
