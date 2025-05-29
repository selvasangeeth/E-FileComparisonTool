// Payer Info
const csvPayerReferenceNumber = "Payer reference number";
const csvPayerTypeOfTIN = "Payer type of TIN (1=EIN 2=SSN)*";
const csvPayerTIN = "Payer TIN*";
const csvPayerName = "Payer name (if the payer TIN is EIN)*";
const csvPayerFirstName = "Payer first name (if the payer TIN is SSN)*";
const csvPayerMiddleInitial = "Payer middle initial (if the payer TIN is SSN)";
const csvPayerLastName = "Payer last name (if the payer TIN is SSN)*";
const csvPayerSuffix = "Payer suffix (if the payer TIN is SSN) (1=Jr 2=Sr 3=I 4=II 5=III 6=IV 7=V 8=VI 9=VII)";
const csvPayerDBA = "Payer DBA/trade name";
const csvPayerCountry = "Payer country*";
const csvPayerAddress1 = "Payer address line 1*";
const csvPayerAddress2 = "Payer address line 2";
const csvPayerCity = "Payer city/town*";
const csvPayerState = "Payer state/province/territory*";
const csvPayerZip = "Payer ZIP code/postal code*";
const csvPayerEmail = "Payer email address";
const csvPayerPhone = "Payer phone number";
const csvGroupNames = "Group names";


// Recipient Info
const csvRecipientReferenceNumber = "Recipient reference number";
const csvRecipientTypeOfTIN = "Recipient type of TIN (1=EIN 2=SSN 3=ITIN 4=ATIN 5=TIN not provided)*";
const csvRecipientTIN = "Recipient TIN*";
const csvRecipientName = "Recipient name (if the recipient TIN is EIN or TIN not provided)*";
const csvRecipientFirstName = "Recipient first name (if the recipient TIN is SSN, ATIN or ITIN)*";
const csvRecipientMiddleInitial = "Recipient middle initial (if the recipient TIN is SSN, ATIN or ITIN)";
const csvRecipientLastName = "Recipient last name (if the recipient TIN is SSN, ATIN or ITIN)*";
const csvRecipientSuffix = "Recipient suffix (if the recipient TIN is SSN, ATIN or ITIN) (1=Jr 2=Sr 3=I 4=II 5=III 6=IV 7=V 8=VI 9=VII)";
const csvRecipientDBA = "Recipient DBA/trade name";
const csvRecipientCountry = "Recipient country*";
const csvRecipientAddress1 = "Recipient address line 1*";
const csvRecipientAddress2 = "Recipient address line 2";
const csvRecipientCity = "Recipient city/town*";
const csvRecipientState = "Recipient state/province/territory*";
const csvRecipientZip = "Recipient ZIP code/postal code*";
const csvRecipientEmail = "Recipient email address";
const csvRecipientPhone = "Recipient phone number";

// Other Fields
const csvAccountNumber = "Account number";
const csvSecondTINNotice = "Second TIN not. (Yes/No or 1/0 or True/False or X/Y=Yes N=No)";
const csvBox1 = "Box 1 Nonemployee compensation*";
const csvBox2 = "Box 2 Payer made direct sales totaling $5,000 or more of consumer products to recipient for resale (Yes/No or 1/0 or True/False or X/Y=Yes N=No)";
const csvBox4 = "Box 4 Federal income tax withheld";
const csvBox5a = "Box 5a State tax withheld";
const csvBox6aState = "Box 6a State";
const csvBox6aStateNo = "Box 6a Payer state no.";
const csvBox7aIncome = "Box 7a State income";
const csvBox5bSecondStateTax = "Box 5b Second state tax withheld";
const csvBox6bSecondState = "Box 6b Second state";
const csvBox6bSecondStateNo = "Box 6b Second payer state no";
const csvBox7bSecondStateIncome = "Box 7b Second State income";

// Export all
module.exports = {
  csvPayerReferenceNumber,
  csvPayerTypeOfTIN,
  csvPayerTIN,
  csvPayerName,
  csvPayerFirstName,
  csvPayerMiddleInitial,
  csvPayerLastName,
  csvPayerSuffix,
  csvPayerDBA,
  csvPayerCountry,
  csvPayerAddress1,
  csvPayerAddress2,
  csvPayerCity,
  csvPayerState,
  csvPayerZip,
  csvPayerEmail,
  csvPayerPhone,
  csvGroupNames,

  csvRecipientReferenceNumber,
  csvRecipientTypeOfTIN,
  csvRecipientTIN,
  csvRecipientName,
  csvRecipientFirstName,
  csvRecipientMiddleInitial,
  csvRecipientLastName,
  csvRecipientSuffix,
  csvRecipientDBA,
  csvRecipientCountry,
  csvRecipientAddress1,
  csvRecipientAddress2,
  csvRecipientCity,
  csvRecipientState,
  csvRecipientZip,
  csvRecipientEmail,
  csvRecipientPhone,

  csvAccountNumber,
  csvSecondTINNotice,
  csvBox1,
  csvBox2,
  csvBox4,
  csvBox5a,
  csvBox6aState,
  csvBox6aStateNo,
  csvBox7aIncome,
  csvBox5bSecondStateTax,
  csvBox6bSecondState,
  csvBox6bSecondStateNo,
  csvBox7bSecondStateIncome,
};
