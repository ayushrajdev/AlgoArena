export interface CodeExecutorStrategy {
    execute({ code, inputTestCase }: { code: string; inputTestCase: string }): Promise<any>;
}
