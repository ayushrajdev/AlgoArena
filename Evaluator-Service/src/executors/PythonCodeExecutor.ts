import { Images } from "../utils/constants.js";
import BaseCodeExecutor from "./BaseCodeExecutor.js";

export default class PythonCodeExecutor extends BaseCodeExecutor {
    image = Images.Python;
    buildCommand(code: string, inputTestCase: string): string {
        return `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    }
}
