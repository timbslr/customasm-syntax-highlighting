This extension uses static syntax analysis by analyzing files with regex as well as semantic syntax analysis for highlighting mnemonics e.g.

## Setting up semantic syntax highlighting

In order to use the full potential of this extension, you have to set up the path to all files containing rules that should be used in semantic syntax highlighting first.

### Option 1: Specify in package.json

If you have a package.json, you can insert the following array of paths there. The array should include all paths to files containing rules that were defined with the `#ruledef` command:

```json
"customasmRuleDefinitions": ["exampleFile1.asm", "src/exampleFile2.asm"]
```

## Option 2: Use a dedicated .customasm file

If you don't use npm in your project and you don't have a package.json file, you can also create a dedicated file containing the paths to the rules. At the root of your workspace, create a file named `.customasm.json` which contains the following content with the paths to the rule definitions:

```json
{
	"ruleDefinitions": ["exampleFile1.asm", "src/exampleFile2.asm"]
}
```

If the paths are specified in the `package.json` AND in `.customasm.json`, only the paths in `package.json` are being used. The one in `.customasm.json` will be ignored!

## Requirements

This extension has some requirements in order to work properly:

- All ruledef's and subruledef's have to be described in exactly a single line of code. Multiple lines per rule will break the semantic syntax highlighting
- If you change the "ruleDefinitions" or "customasmRuleDefinitions", please restart the extension
