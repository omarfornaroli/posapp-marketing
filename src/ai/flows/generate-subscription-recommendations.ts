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

Consider the following factors when making your recommendations:
- Larger or more complex businesses might prefer premium plans.
- Recommend a monthly contract by default.

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
