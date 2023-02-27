import type { H1BRecord } from "./types";

export const mergeH1BRecords = (recordA: H1BRecord, recordB: H1BRecord): H1BRecord => {
  return {
    year: recordA.year,
    naics: recordA.naics,
    initial_approval: recordA.initial_approval + recordB.initial_approval,
    initial_denial: recordA.initial_denial + recordB.initial_denial,
    continuing_approval: recordA.continuing_approval + recordB.continuing_approval,
    continuing_denial: recordA.continuing_denial + recordB.continuing_denial,
  }
}