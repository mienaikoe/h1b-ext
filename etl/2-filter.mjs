import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

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

const THRESHOLD = 5;

const buildCSV = (h1bData) => {
  console.log(`Building CSV with ${h1bData.length} Rows`, h1bData[0]);

  const csvstring = stringify([
    ALL_COLUMNS,
    ...h1bData.map((row) => Object.values(row)),
  ]);

  fs.writeFile(`./generated/_ALL_${THRESHOLD}.csv`, csvstring, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

fs.readFile("./generated/_ALL.csv", function (err, fileData) {
  if (err) {
    reject(err);
  }
  if (!fileData) {
    reject("No File Data");
  }

  let rows = parse(fileData, {
    columns: true,
    trim: true,
    cast: true,
  });

  rows = rows.filter((row) => {
    return row["Continuing Approval"] >= 5;
  });

  buildCSV(rows);
});
