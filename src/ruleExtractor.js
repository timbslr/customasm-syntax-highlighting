import { existsSync, readFileSync } from "fs";
import { isAbsolute, join, resolve } from "path";
import * as vscode from "vscode";

/*example object:
{
	"mnemonic": "add",
	"operands": [
		{
			"name": "...",
			"type": "..."
		}
	]
}
	*/
export function extractRulesAndSubrules() {
	const ruledefPaths = getRuledefPaths();
	const rules = [];
	const subrules = [];
	for (const ruledefPath of ruledefPaths) {
		const content = readFileSync(ruledefPath).toString();
		const ruledefStrings = extractRuledefs(content);
		ruledefStrings.forEach((rule) => {
			rules.push(parseRuleString(rule));
		});
	}
	//return { rules: rules, subrules: subrules };
	return null;
}

function parseRuleString(rule) {
	const indexOfAssignOperator = rule.indexOf("=>");
	const operandsString = rule.substring(0, indexOfAssignOperator);
	const mnemonic = rule.split(" ")[0];
	const operands = rule
		.split(" ")[1]
		.split(",")
		.map((operand) => operand.trim());
	return 1;
}

function extractRuledefs(text) {
	const regex = new RegExp("#ruledef\\s*\\{\\s*[\\s\\S]*?^\\s*\\}\\s*$", "gm"); //TODO match whole block, may be that a single line "}" is not the end of the block
	let match;
	let ruledefs = [];
	while ((match = regex.exec(text)) !== null) {
		let matchedString = match[0];
		matchedString = matchedString.replace(/#ruledef\s*\{/, "");

		const newRules = matchedString
			.trim()
			.split("\n")
			.map((entry) => entry.trim());
		newRules.pop(); //remove last entry as this is the "}" in the single line
		ruledefs = ruledefs.concat(newRules);
	}
	return ruledefs;
}

function getRuledefPaths() {
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

function assertArrayOfStrings(value) {
	if (!Array.isArray(value)) {
		throw new TypeError("Expected an array");
	}

	if (!value.every((item) => typeof item === "string")) {
		throw new TypeError("Expected all elements to be strings");
	}

	return true;
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
