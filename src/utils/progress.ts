/**
 * A brutally simple and sexy classic UNIX-style progress bar.
 * [######....] — no BS, no animations, just raw deployment status.
 * Designed for CLI tools that mean business.
 *
 * Shoutout to GPT — for helping me keep it clean, fast, and unforgiving.
 */
export class ProgressBar {
    private current = 0;

    constructor(private totalSteps: number) {}

    /**
     * Prints the progress for the current step.
     * @param stepName - Description of the current step.
     */
    step(stepName: string): void {
        this.current += 1;
        const filled = Math.round((this.current / this.totalSteps) * 10);
        const bar = '#'.repeat(filled).padEnd(10, '.');
        const index = `[${String(this.current).padStart(2, '0')}/${this.totalSteps}]`;
        console.log(`${index} [${bar}] ${stepName}`);
    }

    /**
     * Called when all steps are finished.
     */
    complete(): void {
        console.log(`\nDeployment complete.`);
    }
}
