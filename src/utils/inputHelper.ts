/**
 * InputHelper for initWizard
 */
import readline from 'readline';

/**
 * Prompts the user for input and validates it.
 *
 * @param prompt - Question to display
 * @param validate - Validator function. Return `null` if valid, or error message string if invalid.
 * @param defaultValue - Optional default value if user presses enter
 * @returns A validated string from user input
 */
export async function askValidated(prompt: string, validate: (input: string) => string | null, defaultValue?: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const ask = (): Promise<string> => new Promise((resolve) => rl.question(prompt, resolve));

    let answer: string;
    while (true) {
        answer = (await ask()).trim() || defaultValue || '';
        const error = validate(answer);
        if (!error) break;
        console.log(`Invalid: ${error}`);
    }

    rl.close();
    return answer;
}
