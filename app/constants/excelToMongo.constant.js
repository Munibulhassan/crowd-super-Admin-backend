const excelToJson = require("convert-excel-to-json");
const appRoot = require('app-root-path')

const keysMapping = {
  A: "faCode",
  B: "venueCode",
  C: "workforceType",
  D: "jobTitle",
  E: "startDate",
  F: "finishDate",
  G: "totalDemand",
  H: "peakShift",
  I: "shiftsPerDay",
};

const excelToJsonConversion = (fileName,folderPath, sheetName, skipHeaderRow) => {
  return new Promise((resolve, rejects) => {
    try {
      resolve( excelToJson({
        sourceFile: appRoot.resolve(`${folderPath}${fileName}`),
        header: {
          rows: skipHeaderRow,
        },
        sheets: [sheetName],
        columnToKey: keysMapping,
      }));
    } catch (error) {
      rejects(error);
    }
  });
};

module.exports = {
    excelToJsonConversion
};