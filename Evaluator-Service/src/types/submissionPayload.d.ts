import type { LanguageType } from "./language.js";

export interface ISubmissionPayload {
    code:string,
    language:LanguageType,
    inputCase:string
} 