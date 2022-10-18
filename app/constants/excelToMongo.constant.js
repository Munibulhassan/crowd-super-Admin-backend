const excelToJson = require("convert-excel-to-json");
const appRoot = require('app-root-path')

// const keysMapping = {
//   A: "functionalarea",
//   B: "facode",
//   C: "jobtype",
//   D: "jobtitle",
//   E: "venuename",
//   F: "venuecode",
  
// };

const excelToJsonConversion = (keysMapping,fileName,folderPath, sheetName, skipHeaderRow) => {
  
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