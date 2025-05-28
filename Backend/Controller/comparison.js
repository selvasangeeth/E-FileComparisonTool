const axios = require("axios");
const csv = require("csvtojson");
const { compareCsvWithJson } = require("./FormComparison/formComparison");
const headers = require("../Controller/Constants/form1099NECconstants");
const { compareBusinessWithJson } = require("../Controller/BussinessVerification/bussinessVerification1099");
const { compareJsonToJson } = require("../Controller/FormComparison/efileComparison");
const { compareApplicationBusinessWithJson } = require("../Controller/BussinessVerification/efileBussinessVerification");
const getReturnIds = async (appOrderId, token) => {
  const response = await axios.post(
    "https://tbs-gatewayapi.stssprint.com/FormW21099Dashboard/GetReturnIdsUsingAppOrderId",
    { AppOrderId: appOrderId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.ReturnDetail.map(r => ({
    returnId: r.ReturnId,
    firstName: r.FirstName,
    lastName: r.LastName,
    tin: r.Tin,
  }));
};

const getReturnJson = async (returnId, token) => {
  const response = await axios.post(
    "https://tbs-gatewayapi.stssprint.com/Business/GetReturnJSONByReturnId",
    { ReturnId: returnId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const getOrderDetails = async (appOrderId) => {

  const url = `https://tbs-efileapi.stssprint.com/ServicesApi2022/api/CommonValidation/GetOrderDetailPopUp?appOrderId=${appOrderId}&callFrom=undefined`;
  const response = await axios.get(url);
  return response.data;
};

const getEFileJson = async (submissionId) => {
  try {
    const response = await axios.get(
      `https://tbs-efileapi.stssprint.com/ServicesApi2022/api/CommonValidation/GetErrorAppJSONByLinkReurnDetailId`,
      {
        params: {
          linkReurnDetailId: submissionId
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching E-File JSON:', error.message);
    throw error;
  }
};


const compareCsvWithApi = async (req, res) => {
  try {
    const { appOrderId, token } = req.body;
    const csvFile = req.file;

    if (!csvFile) {
      return res.status(400).json({ error: "CSV file is missing." });
    }

    const csvData = await csv().fromString(csvFile.buffer.toString());
    const returnIdList = await getReturnIds(appOrderId, token);
    const mismatches = [];

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];

      const fullTin = row[headers.csvRecipientTIN]?.trim();

      const hasOtherFields =
        row[headers.csvRecipientFirstName]?.trim() ||
        row[headers.csvRecipientLastName]?.trim() ||
        row[headers.csvRecipientName]?.trim() ||
        row[headers.csvRecipientSuffix]?.trim() ||
        row[headers.csvRecipientDBA]?.trim() ||
        row[headers.csvRecipientCountry]?.trim() ||
        row[headers.csvRecipientAddress1]?.trim() ||
        row[headers.csvRecipientAddress2]?.trim() ||
        row[headers.csvRecipientCity]?.trim() ||
        row[headers.csvRecipientState]?.trim() ||
        row[headers.csvRecipientZip]?.trim() ||
        row[headers.csvRecipientEmail]?.trim() ||
        row[headers.csvRecipientPhone]?.trim();

      // If TIN missing but other recipient fields exist — report issue and skip
      if (!fullTin && hasOtherFields) {
        console.log("Recipient TIN is missing but other identifying recipient fields are present");
        mismatches.push({
          rowNumber: i + 1,
          row,
          issue: "Recipient TIN is missing but other identifying recipient fields are present",
        });
        continue;
      }

      const csvTinLast4 = fullTin?.slice(-4);

      const matchedReturn = returnIdList.find(r => r.tin?.slice(-4) === csvTinLast4);

      if (!matchedReturn) {
        mismatches.push({
          rowNumber: i + 1,
          row,
          issue: "",
          msg: "No matching ReturnId found or Not Available in Application JSON"
        });
        continue;
      }

      const jsonData = await getReturnJson(matchedReturn.returnId, token);

      const recipientIssues = compareCsvWithJson(row, jsonData);
      const businessIssues = compareBusinessWithJson(row, jsonData);
      const issues = [...recipientIssues, ...businessIssues];

      if (issues.length > 0) {
        mismatches.push({
          returnId: matchedReturn.returnId,
          rowNumber: i + 1,
          row,
          issues,
        });
      }
    }

    res.json({ success: true, mismatches });
  } catch (err) {
    console.error("Comparison Error:", err);
    res.status(500).json({ error: "Comparison failed" });
  }
};


//comparison of Application JSON with E-File JSON

const compareApplicationWithEFile = async (req, res) => {
  try {
    const { appOrderId, token } = req.body;
    // console.log("Request Body:", req.body);

    if (!appOrderId || !token) {
      return res.status(400).json({ error: "appOrderId and token are required" });
    }

    const returnIdList = await getReturnIds(appOrderId, token);
    const mismatches = [];
    // console.log("Return ID List:", returnIdList);

    for (const { returnId } of returnIdList) {
      const applicationJson = await getReturnJson(returnId, token);
      // console.log("Application JSON:", applicationJson);
      const orderDetails = await getOrderDetails(appOrderId);
      // console.log("Order Details:", orderDetails);
      if (!orderDetails || !orderDetails.returnDetails) {
        throw new Error('Invalid Order Details');
      }
      const matchedReturn = orderDetails.returnDetails.find(
        (ret) => ret.returnId === returnId
      );
      if (!matchedReturn) {
        mismatches.push({
          returnId,
          issues,
          row: "",
          msg: "No matching ReturnId found in Efile return details"
        });
      }
      // console.log("returnId", returnId);
      // console.log("Matched Return:", matchedReturn);
      const submissionId = matchedReturn.submissionId;
      // console.log("Submission ID:", submissionId);
      const efileJson = await getEFileJson(submissionId);
      // console.log("Application JSON:", applicationJson);
      // console.log("E-File JSON:", efileJson);
      if (!efileJson) {
        res.send({ msg: `No E-File JSON found for SubmissionId: ${submissionId}` });
      }

      const efileAppJson = efileJson.appJSON;
      const recipientIssues = compareJsonToJson(applicationJson, efileAppJson);
      const businessIssues = compareApplicationBusinessWithJson(applicationJson, efileAppJson);
      const issues = [...recipientIssues, businessIssues];

      if (issues.length > 0) {
        mismatches.push({
          returnId,
          issues,
          row: efileAppJson,
        });
      }
    }

    console.log("reached end.....................");
    res.json({ success: true, mismatches });
  } catch (error) {
    console.error("Error in compareApplicationWithEFile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = { compareCsvWithApi, compareApplicationWithEFile };