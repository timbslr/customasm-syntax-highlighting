import * as vscode from "vscode";
import { semanticTokensProvider, semanticTokensLegend } from "./semanticTokensProvider.js";
import { updateRules } from "./rulesProvider.js";
import { getRuledefPaths } from "./ruledefPathProvider.js";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
	console.log("Extension is now active!");
	updateRules(); //call once to initialize

	// Register the provider for your language
	const selector = { language: "customasm-assembly", scheme: "file" };
	const disposable = vscode.languages.registerDocumentSemanticTokensProvider(selector, semanticTokensProvider, semanticTokensLegend);
	context.subscriptions.push(disposable);

	// The command has been defined in the package.json file
	const disposable2 = vscode.commands.registerCommand("customasm-syntax-highlighting.helloWorld", function () {
		vscode.window.showInformationMessage("Hello World from customasm-syntax-highlighting extension!");
	});

	getRuledefPaths().forEach((ruledefPath) => {
		const ruledefWatcher = vscode.workspace.createFileSystemWatcher(ruledefPath);
		ruledefWatcher.onDidChange((uri) => {
			updateRules();
		});
	});

	context.subscriptions.push(disposable2);
}

export function deactivate() {}
