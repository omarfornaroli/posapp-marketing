'use server';

/**
 * @fileOverview Validates subscription data using AI to ensure all required information is present.
 *
 * - validateSubscriptionData - A function that validates subscription data.
 * - ValidateSubscriptionDataInput - The input type for the validateSubscriptionData function.
 * - ValidateSubscriptionDataOutput - The return type for the validateSubscriptionData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateSubscriptionDataInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  businessAddress: z.string().describe('The address of the business.'),
  businessIndustry: z.string().describe('The industry of the business.'),
  userName: z.string().describe('The name of the user.'),
  password: z.string().describe('The password for the user account.'),
  paymentDetails: z.string().describe('The payment details for Mercado Pago subscription.'),
  termsOfServiceAgreement: z.boolean().describe('Whether the user agreed to the terms of service.'),
});
export type ValidateSubscriptionDataInput = z.infer<typeof ValidateSubscriptionDataInputSchema>;

const ValidateSubscriptionDataOutputSchema = z.object({
  isDataComplete: z.boolean().describe('Whether all required data is present.'),
  missingFields: z.array(z.string()).describe('List of missing fields, if any.'),
  recommendations: z.string().describe('Personalized recommendations for subscription service.'),
});
export type ValidateSubscriptionDataOutput = z.infer<typeof ValidateSubscriptionDataOutputSchema>;

export async function validateSubscriptionData(input: ValidateSubscriptionDataInput): Promise<ValidateSubscriptionDataOutput> {
  return validateSubscriptionDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateSubscriptionDataPrompt',
  input: {schema: ValidateSubscriptionDataInputSchema},
  output: {schema: ValidateSubscriptionDataOutputSchema},
  prompt: `You are an AI assistant that validates user-provided data for setting up a Mercado Pago subscription.

  Determine if all the required data is present. If not, identify the missing fields.

  Also, provide personalized recommendations for the subscription service based on the provided business profile details.

  Business Name: {{{businessName}}}
  Business Address: {{{businessAddress}}}
  Business Industry: {{{businessIndustry}}}
  User Name: {{{userName}}}
  Payment Details: {{{paymentDetails}}}
  Terms of Service Agreement: {{{termsOfServiceAgreement}}}

  Output the response in JSON format:
  {
    "isDataComplete": true/false,
    "missingFields": ["field1", "field2", ...],
    "recommendations": "Recommendations for the subscription service."
  }`,
});

const validateSubscriptionDataFlow = ai.defineFlow(
  {
    name: 'validateSubscriptionDataFlow',
    inputSchema: ValidateSubscriptionDataInputSchema,
    outputSchema: ValidateSubscriptionDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
