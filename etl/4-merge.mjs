import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

// const ALL_COLUMNS = [
//   "Fiscal Year",
//   "USCIS Copmany Name",
//   "Initial Approval",
//   "Initial Denial",
//   ""

//   "slug",
//   "companyURL",
//   "companyMembersURL",
//   "companyNameNAICS",
//   "employeesCount",
//   "LinkedIn Company Name",
//   "LinkedIn Company IDs",
// ];

const THRESHOLD = 5;

const DESTINATION_FILE_PATH = `./generated/MERGED_${THRESHOLD}.csv`;

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

const constructLinkedInMap = (linkedInCSV) => {
  const liMap = new Map();
  linkedInCSV.forEach((company) => {
    const companyName = company["companyNameNAICS"];
    delete company["companyNameNAICS"];
    liMap.set(companyName, company);
  });
  return liMap;
};

const merge = (h1bCSV, linkedInMap) => {
  const mergedData = [];

  let companiesNotFound = 0;

  h1bCSV.forEach((USCISRecord) => {
    const companyNameUSCIS = USCISRecord["Employer"];
    USCISRecord["USCIS Company Name"] = companyNameUSCIS;
    delete USCISRecord["Employer"];

    let linkedInCompany = linkedInMap.get(companyNameUSCIS);

    if (!linkedInCompany) {
      companiesNotFound++;
      linkedInCompany = {
        slug: "",
        companyURL: "",
        companyMembersURL: "",
        employeesCount: "",
        "LinkedIn Company Name": "",
        "LinkedInCompany IDs": "",
      };
    }

    mergedData.push({
      ...USCISRecord,
      ...linkedInCompany,
    });
  }, {});

  console.log(`${companiesNotFound} Not Found`);

  return mergedData;
};

const buildCSV = (data) => {
  console.log(`Building CSV with ${data.length} Rows`, data[0]);

  const csvstring = stringify([
    Object.keys(data[0]),
    ...data.map((row) => Object.values(row)),
  ]);

  fs.writeFile(DESTINATION_FILE_PATH, csvstring, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const h1bCSV = await getNaicsFile();
const linkedInCSV = await getLinkedInFile();
const liMap = constructLinkedInMap(linkedInCSV);
const mergedData = merge(h1bCSV, liMap);
buildCSV(mergedData);
