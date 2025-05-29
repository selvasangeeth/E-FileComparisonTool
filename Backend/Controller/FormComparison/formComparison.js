const headers = require("../Constants/form1099NECconstants");

function compareCsvWithJson(row, jsonData) {
  const recipient = jsonData.returndata?.recipient || {};
  const necForm = jsonData.returndata?.necformdata || {};
  const address = recipient.usaddress || {};
  const states = necForm.states || [];
  const issues = [];

  //Mapping 
  const suffixMap = {
    1: "Jr", 2: "Sr", 3: "I", 4: "II", 5: "III",
    6: "IV", 7: "V", 8: "VI", 9: "VII"
  };

  const tinTypeMap = { "1": "EIN", "2": "SSN" };

  //Normalize
  const normalize = (value) => {
    if (value == null) return '';
    return value.toString().trim().replace(/^0+/, "").replace(/0+$/, "");
  };

  const normalizeSuffix = (value) => {
    if (!value) return "";
    const str = String(value).trim().toUpperCase();
    return suffixMap[str] ? suffixMap[str].toUpperCase() : str;
  };

  //addIssues
  const addIssue = (field, csvValue, jsonValue) => {
    if (normalize(csvValue) !== normalize(jsonValue)) {
      issues.push({ field, csv: csvValue, json: jsonValue });
    }
  };

  const addSuffixIssue = (field, csvValue, jsonValue) => {
    if (normalizeSuffix(csvValue) !== normalizeSuffix(jsonValue)) {
      issues.push({ field, csv: csvValue, json: jsonValue });
    }
  };

  const compareFields = [
    { field: "businessName", csv: row[headers.csvRecipientName], json: recipient.businessNm },
    { field: "firstName", csv: row[headers.csvRecipientFirstName], json: recipient.firstNm },
    { field: "middleName", csv: row[headers.csvRecipientMiddleInitial], json: recipient.middleNm },
    { field: "lastName", csv: row[headers.csvRecipientLastName], json: recipient.lastNm },
    { field: "tradeName", csv: row[headers.csvRecipientDBA], json: recipient.tradenm },
    { field: "address1", csv: row[headers.csvRecipientAddress1], json: address.address1 },
    { field: "address2", csv: row[headers.csvRecipientAddress2], json: address.address2 },
    { field: "city", csv: row[headers.csvRecipientCity], json: address.city },
    { field: "state", csv: row[headers.csvRecipientState], json: address.state },
    { field: "zipCode", csv: row[headers.csvRecipientZip], json: address.zipcd },
    { field: "email", csv: row[headers.csvRecipientEmail], json: recipient.email },
    { field: "phone", csv: row[headers.csvRecipientPhone], json: recipient.phone },
    { field: "Box 1 Nonemployee compensation", csv: row[headers.csvBox1], json: necForm.b1nec },
    { field: "Box 4 Federal income tax withheld", csv: row[headers.csvBox4], json: necForm.b4fedtaxwh },
    { field: "accountNumber", csv: row[headers.csvAccountNumber], json: necForm.accountnumber }
  ];

  compareFields.forEach(({ field, csv, json }) => addIssue(field, csv, json));
  addSuffixIssue("suffix", row[headers.csvRecipientSuffix], recipient.suffix);

  // TIN Type Comparison
  const csvTinTypeValue = normalize(row[headers.csvRecipientTypeOfTIN]);
  const mappedCsvTinType = normalize(tinTypeMap[csvTinTypeValue] || "");
  const jsonTinTypeValue = normalize(recipient.tintype);

  if (mappedCsvTinType !== jsonTinTypeValue) {
    issues.push({
      field: "tinType",
      csv: csvTinTypeValue,
      json: jsonTinTypeValue
    });
  }

  // Primary State comparison
  const csvHasStateData = row[headers.csvBox6aState] || row[headers.csvBox5a] ||
    row[headers.csvBox6aStateNo] || row[headers.csvBox7aIncome];

  if (states.length === 0 && csvHasStateData) {
    issues.push({
      field: "State info",
      csv: `Box 5a: ${row[headers.csvBox5a] || "N/A"}, Box 6a State: ${row[headers.csvBox6aState] || "N/A"}, State No: ${row[headers.csvBox6aStateNo] || "N/A"}, State Income: ${row[headers.csvBox7aIncome] || "N/A"}`,
      json: "Missing state data"
    });
  }

  if (states.length > 0) {
    const state = states[0];
    addIssue("Box 5a State tax withheld", row[headers.csvBox5a], state.statewh);
    addIssue("Box 6a State", row[headers.csvBox6aState], state.statecd);
    addIssue("Box 6a Payer state no.", row[headers.csvBox6aStateNo], state.stateidnum);
    addIssue("Box 7a State income", row[headers.csvBox7aIncome], state.stateincome);
  }

  // Second State comparison
  const csvHasSecondStateData = row[headers.csvBox6bSecondState] ||
    row[headers.csvBox5bSecondStateTax] ||
    row[headers.csvBox6bSecondStateNo] ||
    row[headers.csvBox7bSecondStateIncome];

  if (states.length <= 1 && csvHasSecondStateData) {
    issues.push({
      field: "Second state info",
      csv: `Second State: ${row[headers.csvBox6bSecondState] || "N/A"}, Tax Withheld: ${row[headers.csvBox5bSecondStateTax] || "N/A"}, State No: ${row[headers.csvBox6bSecondStateNo] || "N/A"}, Income: ${row[headers.csvBox7bSecondStateIncome] || "N/A"}`,
      json: "Missing second state data"
    });
  }

  if (states.length > 1) {
    const secondState = states[1];
    addIssue("Box 5b Second state tax withheld", row[headers.csvBox5bSecondStateTax], secondState.statewh);
    addIssue("Box 6b Second state", row[headers.csvBox6bSecondState], secondState.statecd);
    addIssue("Box 6b Second payer state no.", row[headers.csvBox6bSecondStateNo], secondState.stateidnum);
    addIssue("Box 7b Second state income", row[headers.csvBox7bSecondStateIncome], secondState.stateincome);
  }

  return issues;
}

module.exports = {
  compareCsvWithJson
};
