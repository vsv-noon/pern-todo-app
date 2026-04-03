import { TurnstileServerValidationResponse } from '@marsidev/react-turnstile';

// const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
// const VERIFY_ENDPOINT = process.env.TURNSTILE_VERIFY_ENDPOINT;

import { ENV } from '../config/env.js';

export async function verifyTurnstileToken(
  token: string
): Promise<{ success: boolean; errors?: string[] }> {
  const formData = new URLSearchParams({
    secret: ENV.TURNSTILE_SECRET,
    response: token,
  });

  try {
    const response = await fetch(ENV.VERIFY_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    const data = (await response.json()) as TurnstileServerValidationResponse;

    return {
      success: data.success,
      errors: data['error-codes'],
    };
  } catch (err) {
    console.error('Turnstile Error:', err);
    return { success: false, errors: ['internal-error'] };
  }
}
