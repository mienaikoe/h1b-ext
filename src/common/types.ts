
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
  company_ids: string[],
  slug: string | undefined,
}

export type H1BEntity = {
  company_name: string,
  legal_company_name: string,
  tax_id: number | null,
  linkedin: H1BLinkedIn,
  location: H1BLocation,
  records: H1BRecord[],
}

// Actions

export enum DTSAction {
  getH1BDataById = "getH1BDataById",
  getH1BDataBySlug = "getH1BDataBySlug"
};

// Request Payloads
export type DTSPayloadGetH1BDataById = { ids: string[] };
export type DTSPayloadGetH1BDataBySlug = { slug: string };
export type DTSPayload = DTSPayloadGetH1BDataById | DTSPayloadGetH1BDataBySlug;

// Requests
export type DTSRequestGeneric<T extends DTSPayload> = {
  action: DTSAction,
  payload: T
};
export type DTSRequestGetH1BDataById = DTSRequestGeneric<DTSPayloadGetH1BDataById> & {
  action: DTSAction.getH1BDataById,
}
export type DTSRequestGetH1BDataBySlug = DTSRequestGeneric<DTSPayloadGetH1BDataBySlug> & {
  action: DTSAction.getH1BDataBySlug,
}
export type DTSRequest = DTSRequestGetH1BDataById | DTSRequestGetH1BDataBySlug;

// Response Payloads
export type DTSResponsePayloadGetH1BDataById = Record<string, H1BEntity[]>;
export type DTSResponsePayloadGetH1BDataBySlug = H1BEntity[];
export type DTSResponsePayload = DTSResponsePayloadGetH1BDataById | DTSResponsePayloadGetH1BDataBySlug;

// Responses
export type DTSResponseGeneric<T extends DTSResponsePayload> = {
  error?: Error,
  payload: T,
}

export type DTSResponseGetH1BDataById = DTSResponseGeneric<DTSResponsePayloadGetH1BDataById>;
export type DTSResponseGetH1BDataBySlug = DTSResponseGeneric<DTSResponsePayloadGetH1BDataBySlug>;
export type DTSResponse = DTSResponseGetH1BDataById | DTSResponseGetH1BDataBySlug;
