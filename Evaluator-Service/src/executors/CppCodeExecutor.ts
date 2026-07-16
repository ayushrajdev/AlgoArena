import { Images } from "../utils/constants.js";
import BaseCodeExecutor from "./BaseCodeExecutor.js";

export default class CppCodeExecutor extends BaseCodeExecutor {
    image = Images.Cpp;
    buildCommand(code: string, inputTestCase: string): string {
        return `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | stdbuf -oL -eL ./main`;
    }
}
