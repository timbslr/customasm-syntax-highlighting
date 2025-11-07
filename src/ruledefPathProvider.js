import * as vscode from "vscode";
import { isAbsolute, join, resolve } from "path";
import { readFileSync } from "fs";

export function getRuledefPaths() {
	const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	const packagePath = join(workspacePath, "package.json");
	const customasmConfigPath = join(workspacePath, ".customasm.json");
	let paths = [];
	try {
		const packageJSON = JSON.parse(readFileSync(packagePath));
		paths = packageJSON.customasmRuleDefinitions;
		assertArrayOfStrings(paths);
		return toAbsolutePaths(paths, workspacePath.toString());
	} catch (err1) {
		console.log(`package.json not found, trying .customasm.json now`);
		try {
			const customasmConfig = JSON.parse(readFileSync(customasmConfigPath));
			paths = customasmConfig.ruleDefinitions;
			assertArrayOfStrings(paths);
			return toAbsolutePaths(paths, workspacePath.toString());
		} catch (err2) {
			console.error("Couldn't resolve rule definitions - no valid path specified!");
			return [];
		}
	}
}

function toAbsolutePaths(paths, workspacePath) {
	const absolutePaths = [];

	for (const path of paths) {
		if (isAbsolute(path)) {
			absolutePaths.push(path);
		} else {
			absolutePaths.push(resolve(workspacePath, path));
		}
	}

	return absolutePaths;
}

function assertArrayOfStrings(value) {
	if (!Array.isArray(value)) {
		throw new TypeError("Expected an array");
	}

	if (!value.every((item) => typeof item === "string")) {
		throw new TypeError("Expected all elements to be strings");
	}

	return true;
}
