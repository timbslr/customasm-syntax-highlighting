const tokenMapping = [
	{
		tokenKind: "mnemonic",
		mappedTokenType: "struct",
		mappedTokenModifiers: ["declaration"],
	},
	{
		tokenKind: "subruleOperand",
		mappedTokenType: "operator",
		mappedTokenModifiers: ["declaration"],
	},
];

/**
 * Provides the correct mapping for the given tokenKind
 * @param {string} tokenKind The kind of token that should be found, e.g. mnemonic
 * @returns {{tokenKind: string, mappedTokenType: string, mappedTokenModifiers: string[]}}
 */
export function getTokenMapping(tokenKind: string): { tokenKind: string; mappedTokenType: string; mappedTokenModifiers: string[] } | undefined {
	return tokenMapping.find((tokenObject) => tokenObject.tokenKind === tokenKind);
}
