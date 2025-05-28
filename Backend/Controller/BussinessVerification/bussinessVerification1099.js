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

  if (normalize(business.businessnm) !== normalize(row[headers.csvPayerName])) {
    issues.push({
      field: "Payer Name",
      csv: row[headers.csvPayerName],
      json: business.businessnm
    });
  }

  if (normalize(business.firstNm) !== normalize(row[headers.csvPayerFirstName])) {
    issues.push({
      field: "Payer First Name",
      csv: row[headers.csvPayerFirstName],
      json: business.firstNm
    });
  }

  if (normalize(business.middleNm) !== normalize(row[headers.csvPayerMiddleInitial])) {
    issues.push({
      field: "Payer Middle Initial",
      csv: row[headers.csvPayerMiddleInitial],
      json: business.middleNm
    });
  }

  if (normalize(business.lastNm) !== normalize(row[headers.csvPayerLastName])) {
    issues.push({
      field: "Payer Last Name",
      csv: row[headers.csvPayerLastName],
      json: business.lastNm
    });
  }

  if (normalize(business.suffix) !== normalize(row[headers.csvPayerSuffix])) {
    issues.push({
      field: "Payer Suffix",
      csv: row[headers.csvPayerSuffix],
      json: business.suffix
    });
  }

  if (normalize(business.tradenm) !== normalize(row[headers.csvPayerDBA])) {
    issues.push({
      field: "Trade Name (DBA)",
      csv: row[headers.csvPayerDBA],
      json: business.tradenm
    });
  }

  if (normalize(business.email) !== normalize(row[headers.csvPayerEmail])) {
    issues.push({
      field: "Payer Email",
      csv: row[headers.csvPayerEmail],
      json: business.email
    });
  }

  if (normalize(business.phone) !== normalize(row[headers.csvPayerPhone])) {
    issues.push({
      field: "Payer Phone",
      csv: row[headers.csvPayerPhone],
      json: business.phone
    });
  }

  if (normalize(business.phoneextn) !== normalize(row["Payer phone extension"])) {
    issues.push({
      field: "Phone Extension",
      csv: row["Payer phone extension"] || "",
      json: business.phoneextn
    });
  }

  if (normalize(business.fax) !== normalize(row["Payer fax number"])) {
    issues.push({
      field: "Fax",
      csv: row["Payer fax number"] || "",
      json: business.fax
    });
  }

  if (normalize(business.businesstype) !== normalize(row["Payer business type"])) {
    issues.push({
      field: "Business Type",
      csv: row["Payer business type"] || "",
      json: business.businesstype
    });
  }

  if (normalize(business.signingauthority) !== normalize(row["Payer signing authority"])) {
    issues.push({
      field: "Signing Authority",
      csv: row["Payer signing authority"] || "",
      json: business.signingauthority
    });
  }

  if (normalize(business.kindofemployer) !== normalize(row["Payer kind of employer"])) {
    issues.push({
      field: "Kind of Employer",
      csv: row["Payer kind of employer"] || "",
      json: business.kindofemployer
    });
  }

  if (normalize(business.kindofpayer) !== normalize(row["Payer kind of payer"])) {
    issues.push({
      field: "Kind of Payer",
      csv: row["Payer kind of payer"] || "",
      json: business.kindofpayer
    });
  }

  if (normalize(address.address1) !== normalize(row[headers.csvPayerAddress1])) {
    issues.push({
      field: "Payer Address 1",
      csv: row[headers.csvPayerAddress1],
      json: address.address1
    });
  }

  if (normalize(address.address2) !== normalize(row[headers.csvPayerAddress2])) {
    issues.push({
      field: "Payer Address 2",
      csv: row[headers.csvPayerAddress2],
      json: address.address2
    });
  }

  if (normalize(address.city) !== normalize(row[headers.csvPayerCity])) {
    issues.push({
      field: "Payer City",
      csv: row[headers.csvPayerCity],
      json: address.city
    });
  }

  if (normalize(address.state) !== normalize(row[headers.csvPayerState])) {
    issues.push({
      field: "Payer State",
      csv: row[headers.csvPayerState],
      json: address.state
    });
  }

  if (normalize(address.zipcd) !== normalize(row[headers.csvPayerZip])) {
    issues.push({
      field: "Payer ZIP Code",
      csv: row[headers.csvPayerZip],
      json: address.zipcd
    });
  }

  return issues;
}

module.exports = {
  compareBusinessWithJson,
};
