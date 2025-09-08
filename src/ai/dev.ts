import { config } from 'dotenv';
config();

import '@/ai/flows/validate-subscription-data.ts';
import '@/ai/flows/generate-subscription-recommendations.ts';