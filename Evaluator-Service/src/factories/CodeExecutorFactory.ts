import CppCodeExecutor from "../executors/CppCodeExecutor.js";
import JavaCodeExecutor from "../executors/JavaCodeExecutor.js";
import PythonCodeExecutor from "../executors/PythonCodeExecutor.js";
import type { LanguageType } from "../types/language.js";

export default class CodeExecutorFactory {
    static get(language: LanguageType) {
        const map = {
            cpp: new CppCodeExecutor(),
            java: new JavaCodeExecutor(),
            python: new PythonCodeExecutor(),
        };

        return map[language];
    }
}
