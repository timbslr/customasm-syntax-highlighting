import * as vscode from "vscode";
import { rules } from "./rulesProvider.js";

export const hoverProvider = {
	provideHover(document, position, token) {
		const wordRange = document.getWordRangeAtPosition(position, /\w+/);
		if (!wordRange) return;

		const mnemonic = document.getText(wordRange);
		const label = generateLabelForMnemonic(mnemonic);
		if (!label) return;

		return new vscode.Hover(label);
	},
};

export function generateLabelForMnemonic(mnemonic) {
	let label = "";
	for (const operands of rules.get(mnemonic)) {
		const instructionLabel = `${mnemonic} ${operands.map((operand) => (operand.type === null ? operand.name : `{${operand.name}: ${operand.type}}`)).join(", ")}`;
		label += instructionLabel + "  \n";
	}
	return label;
}
