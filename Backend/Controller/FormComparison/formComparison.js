const headers = require("../Constants/form1099NECconstants");

function compareCsvWithJson(row, jsonData) {
  const recipient = jsonData.returndata?.recipient || {};
  const necForm = jsonData.returndata?.necformdata || {};
  const address = recipient.usaddress || {};
  const issues = [];

  function normalize(value) {
    if (value == null) return '';
    const str = value.toString().trim();
    return str.replace(/^0+/, "").replace(/0+$/, "");
  }

  // Business name (for EIN or TIN not provided)
  if (normalize(recipient.businessNm) !== normalize(row[headers.csvRecipientName])) {
    issues.push({
      field: "businessName",
      csv: row[headers.csvRecipientName],
      json: recipient.businessNm
    });
  }

  // First name, Last name, etc.
  if (normalize(recipient.firstNm) !== normalize(row[headers.csvRecipientFirstName])) {
    issues.push({
      field: "firstName",
      csv: row[headers.csvRecipientFirstName],
      json: recipient.firstNm
    });
  }

  if (normalize(recipient.middleNm) !== normalize(row[headers.csvRecipientMiddleInitial])) {
    issues.push({
      field: "middleName",
      csv: row[headers.csvRecipientMiddleInitial],
      json: recipient.middleNm
    });
  }

  if (normalize(recipient.lastNm) !== normalize(row[headers.csvRecipientLastName])) {
    issues.push({
      field: "lastName",
      csv: row[headers.csvRecipientLastName],
      json: recipient.lastNm
    });
  }

// Suffix mapping from number to string
const suffixMap = {
  1: "Jr",
  2: "Sr",
  3: "I",
  4: "II",
  5: "III",
  6: "IV",
  7: "V",
  8: "VI",
  9: "VII",
};

// Normalize and map suffix value
const normalizeSuffix = (value) => {
  if (!value) return "";
  const strValue = String(value).trim().toUpperCase();

  // Check if it's a mapped numeric value
  if (suffixMap[strValue]) return suffixMap[strValue].toUpperCase();

  // Otherwise return as-is
  return strValue;
};


if (
  normalizeSuffix(recipient.suffix) !== normalizeSuffix(row[headers.csvRecipientSuffix])
) {
  issues.push({
    field: "suffix",
    csv: row[headers.csvRecipientSuffix],
    json: recipient.suffix,
  });
}

  const tinTypeMap = {
    "1": "EIN",
    "2": "SSN"
  };

  const csvTinTypeValue = normalize(row[headers.csvRecipientTypeOfTIN]);
  const jsonTinTypeValue = normalize(recipient.tintype);
  const mappedCsvTinType = normalize(tinTypeMap[csvTinTypeValue] || "");

  if (mappedCsvTinType !== jsonTinTypeValue) {
    issues.push({
      field: "tinType",
      csv: csvTinTypeValue,
      json: jsonTinTypeValue
    });
  }

  if (normalize(recipient.tradenm) !== normalize(row[headers.csvRecipientDBA])) {
    issues.push({
      field: "tradeName",
      csv: row[headers.csvRecipientDBA],
      json: recipient.tradenm
    });
  }

  if (normalize(address.address1) !== normalize(row[headers.csvRecipientAddress1])) {
    issues.push({
      field: "address1",
      csv: row[headers.csvRecipientAddress1],
      json: address.address1
    });
  }

  if (normalize(address.address2) !== normalize(row[headers.csvRecipientAddress2])) {
    issues.push({
      field: "address2",
      csv: row[headers.csvRecipientAddress2],
      json: address.address2
    });
  }

  if (normalize(address.city) !== normalize(row[headers.csvRecipientCity])) {
    issues.push({
      field: "city",
      csv: row[headers.csvRecipientCity],
      json: address.city
    });
  }

  if (normalize(address.state) !== normalize(row[headers.csvRecipientState])) {
    issues.push({
      field: "state",
      csv: row[headers.csvRecipientState],
      json: address.state
    });
  }

  if (normalize(address.zipcd) !== normalize(row[headers.csvRecipientZip])) {
    issues.push({
      field: "zipCode",
      csv: row[headers.csvRecipientZip],
      json: address.zipcd
    });
  }

  if (normalize(recipient.email) !== normalize(row[headers.csvRecipientEmail])) {
    issues.push({
      field: "email",
      csv: row[headers.csvRecipientEmail],
      json: recipient.email
    });
  }

  if (normalize(recipient.phone) !== normalize(row[headers.csvRecipientPhone])) {
    issues.push({
      field: "phone",
      csv: row[headers.csvRecipientPhone],
      json: recipient.phone
    });
  }

  // Form Details
  if (normalize(necForm.b1nec) !== normalize(row[headers.csvBox1])) {
    issues.push({
      field: "Box 1 Nonemployee compensation",
      csv: row[headers.csvBox1],
      json: necForm.b1nec
    });
  }

  if (normalize(necForm.b4fedtaxwh) !== normalize(row[headers.csvBox4])) {
    issues.push({
      field: "Box 4 Federal income tax withheld",
      csv: row[headers.csvBox4],
      json: necForm.b4fedtaxwh
    });
  }

  if (normalize(necForm.accountnumber) !== normalize(row[headers.csvAccountNumber])) {
    issues.push({
      field: "accountNumber",
      csv: row[headers.csvAccountNumber],
      json: necForm.accountnumber
    });
  }

  const states = necForm.states || [];

  const csvHasStateData =
    row[headers.csvBox6aState] ||
    row[headers.csvBox5a] ||
    row[headers.csvBox6aStateNo] ||
    row[headers.csvBox7aIncome];

  if (states.length === 0 && csvHasStateData) {
    issues.push({
      field: "State info",
      csv: `Box 5a: ${row[headers.csvBox5a] || "N/A"}, Box 6a State: ${row[headers.csvBox6aState] || "N/A"}, State No: ${row[headers.csvBox6aStateNo] || "N/A"}, State Income: ${row[headers.csvBox7aIncome] || "N/A"}`,
      json: "Missing state data"
    });
  }

  if (states.length > 0) {
    const primaryState = states[0];

    if (normalize(primaryState.statewh) !== normalize(row[headers.csvBox5a])) {
      issues.push({
        field: "Box 5a State tax withheld",
        csv: row[headers.csvBox5a],
        json: primaryState.statewh
      });
    }

    if (normalize(primaryState.statecd) !== normalize(row[headers.csvBox6aState])) {
      issues.push({
        field: "Box 6a State",
        csv: row[headers.csvBox6aState],
        json: primaryState.statecd
      });
    }

    if (normalize(primaryState.stateidnum) !== normalize(row[headers.csvBox6aStateNo])) {
      issues.push({
        field: "Box 6a Payer state no.",
        csv: row[headers.csvBox6aStateNo],
        json: primaryState.stateidnum
      });
    }

    if (normalize(primaryState.stateincome) !== normalize(row[headers.csvBox7aIncome])) {
      issues.push({
        field: "Box 7a State income",
        csv: row[headers.csvBox7aIncome],
        json: primaryState.stateincome
      });
    }
  }

  const csvHasSecondStateData =
    row[headers.csvBox6bSecondState] ||
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

    if (normalize(secondState.statewh) !== normalize(row[headers.csvBox5bSecondStateTax])) {
      issues.push({
        field: "Box 5b Second state tax withheld",
        csv: row[headers.csvBox5bSecondStateTax],
        json: secondState.statewh
      });
    }

    if (normalize(secondState.statecd) !== normalize(row[headers.csvBox6bSecondState])) {
      issues.push({
        field: "Box 6b Second state",
        csv: row[headers.csvBox6bSecondState],
        json: secondState.statecd
      });
    }

    if (normalize(secondState.stateidnum) !== normalize(row[headers.csvBox6bSecondStateNo])) {
      issues.push({
        field: "Box 6b Second payer state no.",
        csv: row[headers.csvBox6bSecondStateNo],
        json: secondState.stateidnum
      });
    }

    if (normalize(secondState.stateincome) !== normalize(row[headers.csvBox7bSecondStateIncome])) {
      issues.push({
        field: "Box 7b Second state income",
        csv: row[headers.csvBox7bSecondStateIncome],
        json: secondState.stateincome
      });
    }
  }

  return issues;
}

module.exports = {
  compareCsvWithJson,
};
