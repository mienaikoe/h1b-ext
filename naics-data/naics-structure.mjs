import fs from "fs";
import { parse } from "csv-parse/sync";

const TableColumns = {
  FiscalYear: "Fiscal Year",
  CleanedEmployerName: "Cleaned Employer Name",
  Employer: "Employer",
  LinkedInID: "LinkedIn ID",
  LinkedInCoURL: "LinkedIn Co URL",
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

const THRESHOLD = 5;

const getFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`./data/_ALL_${THRESHOLD}.csv`, function (err, fileData) {
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

const entityFromRecord = (record) => {
  return {
    company_name: record[TableColumns.Employer],
    tax_id: record[TableColumns.TaxId],
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

const structure = (h1bCSV) => {
  const h1bStructured = {};

  h1bCSV.forEach((record) => {
    const linkedInId = record[TableColumns.LinkedInID];
    if (!linkedInId) {
      return;
    }

    const entity = entityFromRecord(record);

    const existingEntities = h1bStructured[linkedInId];

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
      h1bStructured[linkedInId] = [entity];
    }
  }, {});

  console.log(h1bStructured);

  return h1bStructured;
};

const buildJSON = (h1bData) => {
  console.log(
    `Building JSON with ${Object.keys(h1bData).length} Rows`,
    h1bData[0]
  );

  fs.writeFile(
    `./data/_ALL_${THRESHOLD}.json`,
    JSON.stringify(h1bData),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
};

const h1bCSV = await getFile();
const h1bStructured = structure(h1bCSV);
buildJSON(h1bStructured);
