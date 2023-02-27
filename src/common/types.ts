
// H1B Data

export type H1BRecord = {
  year: number,
  naics: number,
  initial_approval: number,
  initial_denial: number,
  continuing_approval: number,
  continuing_denial: number,
}

type H1BLocation = {
  state?: string,
  city?: string,
  zip?: number,
}

type H1BLinkedIn = {
  employee_count: number,
  slug: string,
  companyIds: string[],
}

export type H1BEntity = {
  company_name: string,
  tax_id: number | null,
  linkedin: H1BLinkedIn,
  location: H1BLocation,
  records: H1BRecord[],
}

// Actions

export enum CSAction {
  getH1BData = "getH1BData"
};

export type CSRequestGeneric<T extends Object> = {
  action: CSAction,
  payload: T
};

export type CSPayloadGetH1BData = {
  ids: string[]
};

export type CSRequestGetH1BData = CSRequestGeneric<CSPayloadGetH1BData> & {
  action: CSAction.getH1BData,
}

export type CSRequest = CSRequestGetH1BData;

export type CSResponseGetH1BData = {
  error?: Error,
  payload: Record<string, H1BEntity[]>
};
