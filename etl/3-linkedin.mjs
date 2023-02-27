import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import queryString from "query-string";

const ALL_COLUMNS = [
  "slug",
  "companyURL",
  "companyMembersURL",
  "companyNameNAICS",
  "employeesCount",
  "LinkedIn Company Name",
  "LinkedIn Company IDs",
];

const THRESHOLD = 5;

const getLinkedInMembersData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `./linkedin-data/linkedin_membersURLs_completed.csv`,
      function (err, fileData) {
        if (err) {
          reject(err);
        }
        if (!fileData) {
          reject("No linkedin members file Data");
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

const getLinkedInCompanyData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `./linkedin-data/linkedin_companies_with_names.csv`,
      function (err, fileData) {
        if (err) {
          reject(err);
        }
        if (!fileData) {
          reject("No linkedin companies file Data");
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

// companyURL,companyMembersURL,comapanyName,employeesCount,employeesText
// https://www.linkedin.com/search/results/people/?currentCompany=%5B%228474%22%2C%2213095%22%2C%2211712711%22%2C%221123727%22%2C%222527930%22%2C%22131053%22%2C%2210168654%22%2C%221308961%22%2C%2211674239%22%2C%22109165%22%2C%2211685606%22%2C%22137284%22%5D&origin=COMPANY_PAGE_CANNED_SEARCH

const employeeCountRegex = new RegExp(/[\d,]+/g);
const linkedInSlugRegex = new RegExp(/company\/(.+)$/);

const parseURL = (urlString) => {
  try {
    return new URL(urlString);
  } catch (err) {
    console.error(err, `URL String: ${urlString}`);
    throw err;
  }
};

const getSlugFromURL = (companyURL) => {
  if (!companyURL) {
    return null;
  }
  const slugMatches = companyURL.match(linkedInSlugRegex);
  return slugMatches[1].replace("/", "");
};

const mergeLinkedInData = (linkedInMembersData, linkedInCompanyData) => {
  const membersMap = new Map();

  linkedInMembersData.forEach((linkedInCompany) => {
    const companyURL = linkedInCompany["companyURL"];
    const companyMembersURL = linkedInCompany["companyMembersURL"];

    const slug = getSlugFromURL(companyURL);

    const employeesText = linkedInCompany["employeesCount"] || "";
    let employeesCount;
    if (typeof employeesText === "number") {
      employeesCount = employeesText;
    } else {
      employeesCount = employeesText
        ? parseInt(employeesText.replace(",", ""))
        : null;
    }

    membersMap.set(slug, {
      slug,
      companyURL,
      companyMembersURL,
      companyNameNAICS: linkedInCompany["comapanyName"],
      linkedinCompanyName: null,
      employeesCount: null,
    });
  });

  linkedInCompanyData.forEach((company) => {
    const companyURL = company["companyURL"];
    const companyMembersURL = company["companyMembersURL"];

    const slug = getSlugFromURL(companyURL);

    if (membersMap.has(slug)) {
      const membersData = membersMap.get(slug);
      membersMap.set(slug, {
        ...membersData,
        slug,
        companyURL,
        companyMembersURL,
        linkedinCompanyName: company["linkedinCompanyName"],
        employeesCount: parseInt(company["employeesCount"]),
      });
    } else {
      membersMap.set(slug, {
        slug,
        companyURL,
        companyMembersURL,
        companyNameNAICS: "",
        linkedinCompanyName: company["linkedinCompanyName"],
        employeesCount: parseInt(company["employeesCount"]),
      });
    }
  });

  return Array.from(membersMap.values());
};

const addExtraColumns = (linkedInData) => {
  const cleanedLinkedInData = linkedInData.map((linkedInCompany) => {
    const membersURLString = linkedInCompany["companyMembersURL"];
    const membersURL = parseURL(membersURLString);
    const parsedQP = queryString.parse(membersURL.search);
    const companyIdString = parsedQP["currentCompany"];
    const companyIds = JSON.parse(companyIdString);
    linkedInCompany["LinkedIn Company IDs"] = companyIds.join("|");

    return linkedInCompany;
  });

  return cleanedLinkedInData;
};

const buildCSV = (linkedInData) => {
  console.log(`Building CSV with ${linkedInData.length} Rows`, linkedInData[0]);

  const csvstring = stringify([
    ALL_COLUMNS,
    ...linkedInData.map((row) => Object.values(row)),
  ]);

  fs.writeFile(`./generated/_LINKEDIN_CLEAN.csv`, csvstring, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const linkedInMembersData = await getLinkedInMembersData();
const linkedInCompanyData = await getLinkedInCompanyData();
const linkedInData = mergeLinkedInData(
  linkedInMembersData,
  linkedInCompanyData
);

const cleanedLinkedInData = addExtraColumns(linkedInData);
buildCSV(cleanedLinkedInData);
