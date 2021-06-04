
/**
 * Measures time that function is executing
 * @param func executable function that should be measured
 * @returns 
 */
export async function measureExecutionTime(func): Promise<number> {
    let start = new Date().getTime();
    await func();
    let finish = new Date().getTime() - start;
    return finish;
}