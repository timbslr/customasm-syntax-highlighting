import CustomAsm from "../CustomAsm";

/**
 * A class that provides useful methods for assertions
 */
export default class Assert {
	/**
	 * Asserts that a given parameter is of type `string[]`
	 * @param value The thing that should be checked
	 * @returns `true` if the input is of type `string[]`
	 * @throws `TypeError` If the parameter is not of type `string[]`
	 */
	static assertArrayOfStrings(value: any): boolean {
		if (!Array.isArray(value)) {
			return false;
		}

		if (!value.every((item) => typeof item === "string")) {
			return false;
		}

		return true;
	}

	static assertOperandInstanceMatchingDefinition(operandInstanceString: string, operandType: string | null) {
		if (!operandType) {
			return true;
		}

		//check if operand-type was defined in #subrule block
		const match = CustomAsm.operands.get(operandType);
		if (match) {
			return match.includes(operandInstanceString);
		}

		//check if type is number
		const regex = /^(u|s|i)([0-9]+)$/gm;
		if (regex.exec(operandType)) {
			return true;
		}

		return false;
	}
}
