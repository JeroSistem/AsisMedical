'use server';

import {
  summarizePatientRecord,
  SummarizePatientRecordInput,
  SummarizePatientRecordOutput,
} from '@/ai/flows/summarize-patient-record';

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function summarizePatientRecordAction(
  input: SummarizePatientRecordInput
): Promise<ActionResult<SummarizePatientRecordOutput>> {
  try {
    const summary = await summarizePatientRecord(input);
    return { success: true, data: summary };
  } catch (e: any) {
    console.error('Error summarizing patient record:', e);
    return {
      success: false,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}
