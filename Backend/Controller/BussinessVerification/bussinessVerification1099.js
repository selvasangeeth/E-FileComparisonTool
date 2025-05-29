const headers = require("../Constants/form1099NECconstants");

function compareBusinessWithJson(row, jsonData) {
  const business = jsonData.returndata?.business || {};
  const address = business.usaddress || {};
  const issues = [];

  function normalize(value) {
    if (value == null) return '';
    const str = value.toString().trim();
    return str.replace(/^0+/, "").replace(/0+$/, "");
  }

  function compareFields(csvVal, jsonVal, fieldName) {
    // console.log(`${fieldName}: CSV Value: ${csvVal}, JSON Value: ${jsonVal}`);
    if (normalize(csvVal) !== normalize(jsonVal)) {
      issues.push({
        field: fieldName,
        csv: csvVal || "",
        json: jsonVal || ""
      });
    }
  }

  const suffixMap = {
    '1': 'Jr',
    '2': 'Sr',
    '3': 'I',
    '4': 'II',
    '5': 'III',
    '6': 'IV',
    '7': 'V',
    '8': 'VI',
    '9': 'VII'
  };

  // Business Fields
  compareFields(row[headers.csvPayerName], business.businessnm, "Payer Name");
  compareFields(row[headers.csvPayerFirstName], business.firstNm, "Payer First Name");
  compareFields(row[headers.csvPayerMiddleInitial], business.middleNm, "Payer Middle Initial");
  compareFields(row[headers.csvPayerLastName], business.lastNm, "Payer Last Name");

  // logic for suffix
  const csvSuffixCode = normalize(row[headers.csvPayerSuffix]);
  const csvSuffix = suffixMap[csvSuffixCode] || csvSuffixCode;
  compareFields(csvSuffix, business.suffix, "Payer Suffix");

  // Remaining fields
  compareFields(row[headers.csvPayerDBA], business.tradenm, "Trade Name (DBA)");
  compareFields(row[headers.csvPayerEmail], business.email, "Payer Email");
  compareFields(row[headers.csvPayerPhone], business.phone, "Payer Phone");
  // compareFields(row["Payer phone extension"], business.phoneextn, "Phone Extension");
  // compareFields(row["Payer fax number"], business.fax, "Fax");
  // compareFields(row["Payer business type"], business.businesstype, "Business Type");
  // compareFields(row["Payer signing authority"], business.signingauthority, "Signing Authority");
  // compareFields(row["Payer kind of employer"], business.kindofemployer, "Kind of Employer");
  // compareFields(row["Payer kind of payer"], business.kindofpayer, "Kind of Payer");

  // Address Fields
  compareFields(row[headers.csvPayerAddress1], address.address1, "Payer Address 1");
  compareFields(row[headers.csvPayerAddress2], address.address2, "Payer Address 2");
  compareFields(row[headers.csvPayerCity], address.city, "Payer City");
  compareFields(row[headers.csvPayerState], address.state, "Payer State");
  compareFields(row[headers.csvPayerZip], address.zipcd, "Payer ZIP Code");

  return issues;
}

module.exports = {
  compareBusinessWithJson,
};
