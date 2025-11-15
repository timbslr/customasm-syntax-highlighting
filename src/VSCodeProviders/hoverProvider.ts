import * as vscode from "vscode";
import CustomAsm from "../CustomAsm";

export const hoverProvider = {
	provideHover(document: vscode.TextDocument, position: vscode.Position) {
		const wordRange = document.getWordRangeAtPosition(position, /\w+/);
		if (!wordRange) return;

		const mnemonic = document.getText(wordRange);
		const label = generateLabelForMnemonic(mnemonic);
		if (!label) return;

		return new vscode.Hover(label);
	},
};

export function generateLabelForMnemonic(mnemonic: string): string | null {
	let label = "";
	const operandsForMnemonic = CustomAsm.rules.get(mnemonic);
	if (!operandsForMnemonic) {
		return null;
	}

	for (const operands of operandsForMnemonic) {
		const instructionLabel = `${mnemonic} ${operands.map((operand) => (operand.type === null ? operand.name : `{${operand.name}: ${operand.type}}`)).join(", ")}`;
		label += instructionLabel + "  \n";
	}
	return label;
}
