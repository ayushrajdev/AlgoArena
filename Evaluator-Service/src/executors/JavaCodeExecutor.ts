import { Images } from "../utils/constants.js";
import BaseCodeExecutor from "./BaseCodeExecutor.js";

export default class JavaCodeExecutor extends BaseCodeExecutor {
    image = Images.Java;
    buildCommand(code: string, inputTestCase: string): string {
        return `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
    }
}
