// https://airtable.com/appf09NW58EJdypHO/tbl7c2EZiAWML9vay/viwusIkXkQfLlVnO6?blocks=hide
// https://airtable.com/appqvg3t7MeAbxtot/tblT0R12gaWugpUKj/viwppRwnOloc8h0ew?blocks=hide

import Airtable from "airtable";
import type { FieldSet, Table } from "airtable";
import type { AirtableBase } from "airtable/lib/airtable_base";
import type { H1BEntity } from "../../common/types";
import type Fetcher from "./fetcher";

const BASE_ID = 'appqvg3t7MeAbxtot';
const TABLE_ID = 'tblT0R12gaWugpUKj';
const AIRTABLE_API_KEY = 'pat1VZsZHlb0WIHFQ.5ccf6669025c56d1cb32ab556d3c69aa868ae724fe7554f0a7ab5a58519709ff';

enum TableColumns {
  FiscalYear = "Fiscal Year",
  Employer = "Employer",
  LinkedInID = "LinkedIn ID",
  LinkedInCoURL = "LinkedIn Co URL",
  LinkedInCoSlug = "LinkedIn Co Slug",
  Employees = "Employees",
  InitialApproval = "Initial Approval",
  InitialDenial = "InitialDenial",
  ContinuingApproval = "ContinuingApproval",
  ContinuingDenial = "ContinuingDenial",
  NAICS = "NAICS",
  TaxId = "Tax ID",
  State = "State",
  City = "City",
  ZIP = "ZIP",
}

const entityFromRecord = (record: Airtable.Record<FieldSet>): H1BEntity => {
  return {
    company_name: record.get(TableColumns.Employer) as string,
    tax_id: record.get(TableColumns.TaxId) as number,
    linkedin: {
      employee_count: record.get(TableColumns.Employees) as number,
      slug: record.get(TableColumns.LinkedInCoSlug) as string,
      companyIds: (record.get(TableColumns.LinkedInID) as string).split("|"),
    },
    location: {
      state: record.get(TableColumns.State) as string,
      city: record.get(TableColumns.City) as string,
      zip: record.get(TableColumns.ZIP) as number,
    },
    records: [{
      year: record.get(TableColumns.FiscalYear) as number,
      naics: record.get(TableColumns.NAICS) as number,
      initial_approval: record.get(TableColumns.InitialApproval) as number,
      initial_denial: record.get(TableColumns.InitialDenial) as number,
      continuing_approval: record.get(TableColumns.ContinuingApproval) as number,
      continuing_denial: record.get(TableColumns.ContinuingDenial) as number,
    }]
  };
}

class AirtableFetcher implements Fetcher {

  base: AirtableBase;

  constructor(){
    this.base = new Airtable({
      endpointUrl: 'https://api.airtable.com',
      apiKey: AIRTABLE_API_KEY,
      requestTimeout: 10*1000, // 10 seconds
    }).base(BASE_ID);
  }

  getDataForIds = async (ids: string[]): Promise<Record<string, H1BEntity[]>> => {
    const allIds = ids.join(" ");

    const records = await this.base(TABLE_ID).select({
      filterByFormula: `SEARCH({LinkedIn ID}, "${allIds}")`,
      maxRecords: 100,
    }).all();

    return records.reduce((metadataMap: Record<string, H1BEntity[]>, record) => {
      const linkedInId = record.get(TableColumns.LinkedInID);
      if( !linkedInId || typeof linkedInId !== 'string' ){
        return metadataMap;
      }

      const entity = entityFromRecord(record);

      const existingEntities = metadataMap[linkedInId];
      if( existingEntities.length ){
        const matchingEntity = existingEntities.find(existingEntity => {
          return entity.tax_id === existingEntity.tax_id;
        });

        if(matchingEntity){
          matchingEntity.records.push(entity.records[0]);
        } else {
          existingEntities.push(entity);
        }
      } else {
        metadataMap[linkedInId] = [entity]
      }
      return metadataMap;
    }, {});
  }
}

export default AirtableFetcher;