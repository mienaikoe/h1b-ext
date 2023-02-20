import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const REMOVE_TOKENS = [
  " INC",
  " NA",
  " N A",
  " LLC",
  " LP",
  " DBA",
  " USA",
  " NA",
  " TRUST COMPANY",
];

const H1B_STAT_COLS = [
  "Initial Approval",
  "Initial Denial",
  "Continuing Approval",
  "Continuing Denial",
];

const ALL_COLUMNS = [
  "Fiscal Year",
  "Employer",
  "Initial Approval",
  "Initial Denial",
  "Continuing Approval",
  "Continuing Denial",
  "NAICS",
  "Tax ID",
  "State",
  "City",
  "ZIP",
  "Cleaned Employer Name",
];

const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "Puerto Rico",
  "Guam",
  "DC",
  "North Mariana Islands",
];

const cleanEmployerName = (employerName) => {
  if (!employerName) {
    return "";
  }
  return REMOVE_TOKENS.reduce((cleanedName, token) => {
    return cleanedName.replaceAll(token, "");
  }, employerName).trim();
};

const readStateFile = (state) => {
  const stateUpper = state.toUpperCase();
  const stateFile = `./data/${stateUpper}.csv`;
  return new Promise((resolve, reject) => {
    fs.readFile(stateFile, function (err, fileData) {
      if (err) {
        reject(err);
      }
      if (!fileData) {
        reject("No File Data", stateFile);
      }
      const rows = parse(fileData, {
        columns: true,
        trim: true,
      });
      resolve(rows);
    });
  });
};

const dedupeH1BData = (h1bData) => {
  return h1bData.reduce((agg, row) => {
    const employerName = cleanEmployerName(row["Employer"]);
    if (!employerName) {
      console.log("No Employer Name", row);
      return agg;
    }
    const taxId = row["Tax ID"];
    const naics = row["NAICS"];

    H1B_STAT_COLS.forEach((col) => {
      row[col] = parseInt(row[col]);
    });

    const uniqueId = `${taxId}-${naics}`;
    const existing = agg[uniqueId];
    if (existing) {
      H1B_STAT_COLS.forEach((col) => {
        existing[col] = row[col] + existing[col];
      });
    } else {
      agg[uniqueId] = {
        ...row,
        cleanedEmployerName: employerName,
      };
    }

    return agg;
  }, {});
};

const buildCSV = (h1bData) => {
  console.log(`Building CSV with ${h1bData.length} Rows`);

  const csvstring = stringify([
    ALL_COLUMNS,
    ...h1bData.map((row) => Object.values(row)),
  ]);

  fs.writeFile("./data/_ALL.csv", csvstring, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

Promise.all(STATES.map((state) => readStateFile(state))).then((h1bData) => {
  const dedupedMap = dedupeH1BData(h1bData.flat());
  const vals = Object.values(dedupedMap);
  buildCSV(vals);
});
