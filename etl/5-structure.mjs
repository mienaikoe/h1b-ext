import fs from "fs";
import { parse } from "csv-parse/sync";

const TableColumns = {
  FiscalYear: "Fiscal Year",
  CleanedEmployerName: "Cleaned Employer Name",
  Employer: "USCIS Company Name",
  LinkedInCompanyIDs: "LinkedIn Company IDs",
  LinkedInCoURL: "companyURL",
  LinkedInMembersURL: "companyMembersURL",
  LinkedInCompanyName: "LinkedIn Company Name",
  EmployeesCount: "employeesCount",
  InitialApproval: "Initial Approval",
  InitialDenial: "Initial Denial",
  ContinuingApproval: "Continuing Approval",
  ContinuingDenial: "Continuing Denial",
  NAICS: "NAICS",
  TaxId: "Tax ID",
  State: "State",
  City: "City",
  ZIP: "ZIP",
};
/**
 *  * Fiscal Year,
 * Initial Approval,
 * Initial Denial,
 * Continuing Approval,
 * Continuing Denial,
 * NAICS,
 * Tax ID,
 * State,
 * City,
 * ZIP,
 * Cleaned Employer Name,
 * USCIS Company Name,
 * slug,
 * companyURL,
 * companyMembersURL,
 * employeesCount,
 * LinkedIn Company Name,
 * LinkedIn Company IDs
 */

const DESTINATION_FILE_PATH = `../src/background/fetchers/static-h1b-data-20230220.json`;

const THRESHOLD = 5;

const getMergedFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `./generated/MERGED_${THRESHOLD}.csv`,
      function (err, fileData) {
        if (err) {
          reject(err);
        }
        if (!fileData) {
          reject("No File Data");
        }
        const rows = parse(fileData, {
          columns: true,
          trim: true,
          cast: true,
        });

        resolve(rows);
      }
    );
  });
};

/*

*/

const entityFromRecords = (record) => {
  const linkedInCompanyIds = record[TableColumns.LinkedInCompanyIDs];

  let url = record[TableColumns.LinkedInCoURL] || "";
  if (url[url.length - 1] === "/") {
    url = url.substring(0, url.length - 1);
  }
  const slug = url.split("/").pop();

  return {
    company_name: record[TableColumns.LinkedInCompanyName],
    legal_company_name: record[TableColumns.Employer],
    tax_id: record[TableColumns.TaxId] || null,
    linkedin: {
      company_ids: linkedInCompanyIds
        ? new String(linkedInCompanyIds).split("|")
        : [],
      slug,
      employee_count: parseInt(record[TableColumns.EmployeesCount]),
    },
    location: {
      state: record[TableColumns.State],
      city: record[TableColumns.City],
      zip: record[TableColumns.ZIP],
    },
    records: [
      {
        naics: record[TableColumns.NAICS],
        year: record[TableColumns.FiscalYear],
        initial_approval: record[TableColumns.InitialApproval],
        initial_denial: record[TableColumns.InitialDenial],
        continuing_approval: record[TableColumns.ContinuingApproval],
        continuing_denial: record[TableColumns.ContinuingDenial],
      },
    ],
  };
};

const structure = (mergedCSV) => {
  const structuredData = {};

  let linkedInInfoMissing = 0;
  mergedCSV.forEach((record) => {
    const linkedInCompanyIDs = record["LinkedIn Company IDs"];
    if (!linkedInCompanyIDs) {
      linkedInInfoMissing++;
      return;
    }

    const entity = entityFromRecords(record);

    entity.linkedin.company_ids.forEach((linkedInCompanyId) => {
      const existingEntities = structuredData[linkedInCompanyId];

      if (existingEntities?.length) {
        const matchingEntity = existingEntities.find((existingEntity) => {
          return entity.tax_id === existingEntity.tax_id;
        });

        if (matchingEntity) {
          matchingEntity.records.push(entity.records[0]);
        } else {
          existingEntities.push(entity);
        }
      } else {
        structuredData[linkedInCompanyId] = [entity];
      }
    });
  }, {});

  console.warn(`No LinkedIn Information: ${linkedInInfoMissing}`);

  console.log(Object.values(structuredData)[0]);

  return structuredData;
};

const buildJSON = (structuredData) => {
  console.log(
    `Building JSON with ${Object.keys(structuredData).length} Rows`,
    structuredData[0]
  );

  fs.writeFile(
    DESTINATION_FILE_PATH,
    JSON.stringify(structuredData, null, 2),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
};

const mergedCSV = await getMergedFile();
const structuredData = structure(mergedCSV);
buildJSON(structuredData);
