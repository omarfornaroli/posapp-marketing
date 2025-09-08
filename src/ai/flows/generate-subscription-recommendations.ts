'use server';

/**
 * @fileOverview Generates personalized subscription recommendations based on business profile details.
 *
 * - generateSubscriptionRecommendations - A function that generates subscription recommendations.
 * - SubscriptionRecommendationsInput - The input type for the generateSubscriptionRecommendations function.
 * - SubscriptionRecommendationsOutput - The return type for the generateSubscriptionRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SubscriptionRecommendationsInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  industry: z.string().describe('The industry of the business.'),
  annualRevenue: z.number().describe('The annual revenue of the business.'),
  numberOfEmployees: z.number().describe('The number of employees in the business.'),
  paymentPreferences: z.string().describe('Payment preferences of the business.'),
  softwareNeeds: z.string().describe('The specific software needs of the business.'),
});
export type SubscriptionRecommendationsInput = z.infer<
  typeof SubscriptionRecommendationsInputSchema
>;

const SubscriptionRecommendationsOutputSchema = z.object({
  recommendedContractLength: z
    .string()
    .describe('The recommended contract length (e.g., monthly, annually).'),
  recommendedPriceLevel: z.string().describe('The recommended price level (e.g., basic, premium).'),
  justification: z.string().describe('The justification for the recommendations.'),
});
export type SubscriptionRecommendationsOutput = z.infer<
  typeof SubscriptionRecommendationsOutputSchema
>;

export async function generateSubscriptionRecommendations(
  input: SubscriptionRecommendationsInput
): Promise<SubscriptionRecommendationsOutput> {
  return generateSubscriptionRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'subscriptionRecommendationsPrompt',
  input: {schema: SubscriptionRecommendationsInputSchema},
  output: {schema: SubscriptionRecommendationsOutputSchema},
  prompt: `You are an expert subscription plan advisor. Based on the business profile details provided, you will recommend a suitable contract length and price level.

Business Name: {{{businessName}}}
Industry: {{{industry}}}
Annual Revenue: {{{annualRevenue}}}
Number of Employees: {{{numberOfEmployees}}}
Payment Preferences: {{{paymentPreferences}}}
Software Needs: {{{softwareNeeds}}}

Consider the following factors when making your recommendations:
- Businesses with higher annual revenue and more employees may benefit from premium plans with more features.
- Businesses with specific software needs should be matched with plans that offer those features.
- Payment preferences should be considered when recommending contract lengths.

Provide a brief justification for your recommendations.
`,
});

const generateSubscriptionRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateSubscriptionRecommendationsFlow',
    inputSchema: SubscriptionRecommendationsInputSchema,
    outputSchema: SubscriptionRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
