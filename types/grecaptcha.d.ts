// The parts of the reCAPTCHA v3 script the contact form uses
declare global {
	const grecaptcha: {
		ready(callback: () => void): void,
		execute(siteKey: string, options: { action: string }): Promise<string>
	}
}

export {}
