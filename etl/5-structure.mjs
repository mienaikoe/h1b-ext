import fs from "fs";
import { parse } from "csv-parse/sync";

const TableColumns = {
  FiscalYear: "Fiscal Year",
  CleanedEmployerName: "Cleaned Employer Name",
  Employer: "Employer",
  LinkedInID: "LinkedIn ID",
  LinkedInCoURL: "LinkedIn Co URL",
  LinkedInCompanyName: "LinkedIn Company Name",
  Employees: "Employees",
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

const DESTINATION_FILE_PATH = `../src/background/fetchers/static-h1b-data-20230220.json`;

const THRESHOLD = 5;

const getNaicsFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`./generated/_ALL_${THRESHOLD}.csv`, function (err, fileData) {
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
    });
  });
};

const getLinkedInFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`./generated/_LINKEDIN_CLEAN.csv`, function (err, fileData) {
      if (err) {
        reject(err);
      }
      if (!fileData) {
        reject("No linkedin file Data");
      }
      const rows = parse(fileData, {
        columns: true,
        trim: true,
        cast: false,
      });

      resolve(rows);
    });
  });
};

/*
Fiscal Year,
Initial Approval,
Initial Denial,Continuing Approval,Continuing Denial,
NAICS,Tax ID,State,City,ZIP,
Cleaned Employer Name,
USCIS Copmany Name,
slug,companyURL,companyMembersURL,employeesCount,
LinkedIn Company Name,LinkedIn Company IDs
*/

const entityFromRecords = (naicsRecord, linkedInRecord) => {
  return {
    company_name: naicsRecord[TableColumns.LinkedInCompanyName],
    tax_id: naicsRecord[TableColumns.TaxId] || null,
    linkedin: {
      companyIds: linkedInRecord["LinkedIn Company IDs"].split("|"),
      employee_count: parseInt(linkedInRecord["employeesCount"]),
      slug: linkedInRecord["slug"],
    },
    location: {
      state: naicsRecord[TableColumns.State],
      city: naicsRecord[TableColumns.City],
      zip: naicsRecord[TableColumns.ZIP],
    },
    records: [
      {
        naics: naicsRecord[TableColumns.NAICS],
        year: naicsRecord[TableColumns.FiscalYear],
        initial_approval: naicsRecord[TableColumns.InitialApproval],
        initial_denial: naicsRecord[TableColumns.InitialDenial],
        continuing_approval: naicsRecord[TableColumns.ContinuingApproval],
        continuing_denial: naicsRecord[TableColumns.ContinuingDenial],
      },
    ],
  };
};

const constructLinkedInMap = (linkedInCSV) => {
  const liMap = new Map();
  linkedInCSV.forEach((company) => {
    const companyName = company["companyName"];
    liMap.set(companyName, company);
  });
  return liMap;
};

const structure = (h1bCSV, linkedInMap) => {
  const structuredData = {};

  h1bCSV.forEach((record) => {
    const companyName = record["Employer"];

    const linkedInCompany = linkedInMap.get(companyName);

    if (!linkedInCompany) {
      console.warn(`Company Not Found: ${companyName}`);
      return;
    }

    const entity = entityFromRecords(record, linkedInCompany);

    entity.linkedin.companyIds.forEach((linkedInCompanyId) => {
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

  console.log(structuredData[0]);

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

const h1bCSV = await getNaicsFile();
const linkedInCSV = await getLinkedInFile();
const liMap = constructLinkedInMap(linkedInCSV);
const structuredData = structure(h1bCSV, liMap);
buildJSON(structuredData);
