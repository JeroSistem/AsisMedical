'use server';

/**
 * @fileOverview An AI-powered tool to summarize patient medical records.
 *
 * - summarizePatientRecord - A function that summarizes a patient's medical history.
 * - SummarizePatientRecordInput - The input type for the summarizePatientRecord function.
 * - SummarizePatientRecordOutput - The return type for the summarizePatientRecord function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePatientRecordInputSchema = z.object({
  medicalHistory: z.string().describe('The complete medical history of the patient.'),
  currentStatus: z.string().describe('The current status and observations of the patient.'),
});
export type SummarizePatientRecordInput = z.infer<typeof SummarizePatientRecordInputSchema>;

const SummarizePatientRecordOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the patient medical history and current status.'),
});
export type SummarizePatientRecordOutput = z.infer<typeof SummarizePatientRecordOutputSchema>;

export async function summarizePatientRecord(input: SummarizePatientRecordInput): Promise<SummarizePatientRecordOutput> {
  return summarizePatientRecordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePatientRecordPrompt',
  input: {schema: SummarizePatientRecordInputSchema},
  output: {schema: SummarizePatientRecordOutputSchema},
  prompt: `You are an expert medical summarizer.  Your goal is to provide a concise and accurate summary of a patient\'s medical history and current status so that clinicians can quickly review key details and provide better care.

Medical History: {{{medicalHistory}}}

Current Status: {{{currentStatus}}}

Provide a summary of the patient\'s medical history and current status.`, 
});

const summarizePatientRecordFlow = ai.defineFlow(
  {
    name: 'summarizePatientRecordFlow',
    inputSchema: SummarizePatientRecordInputSchema,
    outputSchema: SummarizePatientRecordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
