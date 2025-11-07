import { readFileSync } from "fs";
import * as vscode from "vscode";
import { getRuledefPaths } from "./ruledefPathProvider.js";

export let rules = [];

export function updateRules() {
	rules.length = 0; //clear rules
	const ruledefPaths = getRuledefPaths();
	for (const ruledefPath of ruledefPaths) {
		const content = readFileSync(ruledefPath).toString();
		const ruledefStrings = extractRuledefs(content);
		ruledefStrings.forEach((rule) => {
			rules.push(parseRuleString(rule));
		});
	}

	return rules;
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

function parseRuleString(rule) {
	const indexOfAssignOperator = rule.indexOf("=>");
	const operandsString = rule.substring(0, indexOfAssignOperator);
	const mnemonic = rule.split(" ")[0];
	const operandStrings = rule
		.substring(mnemonic.length, indexOfAssignOperator)
		.split(",")
		.map((operand) => operand.trim());

	const operandObjects = [];
	operandStrings.forEach((operandString) => {
		let match;
		const regex = /\{\s*([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_]+)\s*\}/;
		if ((match = regex.exec(operandString))) {
			const name = match[1];
			const type = match[2];
			operandObjects.push({ name: name, type: type });
		}
	});

	return { mnemonic: mnemonic, operands: operandObjects };
}
