function compareJsonToJson(appJson, efileAppJson) {
  if (!appJson || !efileAppJson) {
    throw new Error("Both application JSON and e-file JSON are required for comparison.");
  }

  const mismatches = [];
  if (typeof efileAppJson === 'string') {
    try {
      efileAppJson = JSON.parse(efileAppJson);
    } catch (err) {
      console.error("Failed to parse efileAppJson", err);
    }
  }

  const appData = appJson.returndata || {};
  const efileData = efileAppJson.ReturnData || {};
  const appRecipient = appData.recipient || {};
  const efileRecipient = efileData.recipient || {};

  const appAddress = appRecipient.usaddress || {};
  const efileAddress = efileRecipient.usAddress || {};

  const appNec = appData.necformdata || {};
  const efileNec = efileData.necFormData || {};

  const compareField = (label, val1, val2) => {
    const normalize = (v) => (v === null || v === undefined) ? '' : v.toString().trim();

    const displayVal1 = normalize(val1);
    const displayVal2 = normalize(val2);

    // console.log(`Comparing ${label}: App Value: ${displayVal1}, E-File Value: ${displayVal2}`);

    if (displayVal1 !== displayVal2) {
      mismatches.push({
        field: label,
        appValue: val1,
        efileValue: val2,
      });
    }
  };


  //State Comparison

  const appStates = appNec.states || [];
  const efileStates = efileNec.states || [];

  const maxStates = Math.max(appStates.length, efileStates.length);


  for (let i = 0; i < maxStates; i++) {
    const appState = appStates[i] || {};
    const efileState = efileStates[i] || {};

    const stateFieldMap = [
      { label: 'states.stateCd', appKey: 'statecd', efileKey: 'stateCd' },
      { label: 'states.stateWH', appKey: 'statewh', efileKey: 'stateWH' },
      { label: 'states.stateIdNum', appKey: 'stateidnum', efileKey: 'stateIdNum' },
      { label: 'states.stateIncome', appKey: 'stateincome', efileKey: 'stateIncome' },
      { label: 'states.stateDistribution', appKey: 'statedistribution', efileKey: 'stateDistribution' },
      { label: 'states.localitydata', appKey: 'localitydata', efileKey: 'localitydata' },
      { label: 'states.isretransmitted', appKey: 'isretransmitted', efileKey: 'isretransmitted' },
      { label: 'states.isPaid', appKey: 'isPaid', efileKey: 'IsPaid' },
    ];

    stateFieldMap.forEach(({ label, appKey, efileKey }) => {
      compareField(`${label}[${i}]`, appState[appKey], efileState[efileKey]);
    });
  }

  // Recipient fields
  compareField('recipient.recipientid', appRecipient.recipientid, efileRecipient.recipientId);
  compareField('recipient.tinType', appRecipient.tintype, efileRecipient.tinType);
  compareField('recipient.tin', appRecipient.tin, efileRecipient.tin);
  compareField('recipient.isforeign', appRecipient.isforeign, efileRecipient.isForeign);
  compareField('recipient.foreignAddress', appRecipient.foreignaddress, efileRecipient.foreignAddress);
  compareField('recipient.email', appRecipient.email, efileRecipient.email);
  compareField('recipient.fax', appRecipient.fax, efileRecipient.fax);
  compareField('recipient.phone', appRecipient.phone, efileRecipient.phone);
  compareField('recipient.recipientgiin', appRecipient.recipientgiin, efileRecipient.recipientGIIN);
  compareField('recipient.recipientftin', appRecipient.recipientftin, efileRecipient.recipientFTIN);
  compareField('recipient.recipientctrycode', appRecipient.recipientctrycode, efileRecipient.recipientCtryCode);
  compareField('recipient.recipientch3code', appRecipient.recipientch3code, efileRecipient.recipientCh3Code);
  compareField('recipient.recipientch4code', appRecipient.recipientch4code, efileRecipient.recipientCh4Code);
  compareField('recipient.recipientlobcode', appRecipient.recipientlobcode, efileRecipient.recipientLobCode);
  compareField('recipient.recipientaccnumber', appRecipient.recipientaccnumber, efileRecipient.recipientAccNumber);
  compareField('recipient.recipientdob', appRecipient.recipientdob, efileRecipient.recipientDob);
  compareField('recipient.firstNm', appRecipient.firstNm, efileRecipient.firstNm);
  compareField('recipient.middleNm', appRecipient.middleNm, efileRecipient.middleNm);
  compareField('recipient.lastNm', appRecipient.lastNm, efileRecipient.lastNm);
  compareField('recipient.suffix', appRecipient.suffix, efileRecipient.suffix);
  compareField('recipient.businessNm', appRecipient.businessNm, efileRecipient.businessNm);
  compareField('recipient.tradenm', appRecipient.tradenm, efileRecipient.tradeNm);
  compareField('recipient.irisRecordId', appRecipient.irisRecordId, efileRecipient.IrisRecordId);
  compareField('recipient.employee', appData.employee, efileData.employee);
  compareField('recipient.formtype', appData.formtype, efileData.formType);
  compareField('recipient.w2formdata', appData.w2formdata, efileData.w2FormData);
  compareField('recipient.miscformdata', appData.miscformdata, efileData.miscFormData);
  compareField('recipient.intformdata', appData.intformdata, efileData.intFormData);
  compareField('recipient.divformdata', appData.divformdata, efileData.divFormData);
  compareField('recipient.rformdata', appData.rformdata, efileData.rFormData);
  compareField('recipient.bformdata', appData.bformdata, efileData.bFormData);
  compareField('recipient.sformdata', appData.sformdata, efileData.sFormData);
  compareField('recipient.gformdata', appData.gformdata, efileData.gFormData);
  compareField('recipient.kformdata', appData.kformdata, efileData.kFormData);
  compareField('recipient.form5498', appData.form5498, efileData.form5498);
  compareField('recipient.form5498esa', appData.form5498esa, efileData.form5498ESA);
  compareField('recipient.form5498sa', appData.form5498sa, efileData.form5498SA);
  compareField('recipient.form1098', appData.form1098, efileData.form1098);
  compareField('recipient.correctedrecipient', appData.correctedrecipient, efileData.correctedRecipient);
  compareField('recipient.correctedaddress', appData.Correctedaddress, efileData.correctedaddress);
  compareField('recipient.neccorrformdata', appData.Neccorrformdata, efileData.necCorrFormData);
  compareField('recipient.misccorrformdata', appData.Misccorrformdata, efileData.miscCorrFormData);
  compareField('recipient.correctedemployeedata', appData.correctedemployeedata, efileData.correctedEmployeeData);
  compareField('recipient.correctedemployeeaddress', appData.correctedemployeeaddress, efileData.correctedEmployeeAddress);
  compareField('recipient.correctedw2formdata', appData.correctedw2formdata, efileData.correctedW2FormData);
  compareField('recipient.prevw2formdata', appData.prevw2formdata, efileData.prevW2FormData);
  compareField('recipient.cformdata', appData.cformdata, efileData.cFormData);
  compareField('recipient.divcorrformdata', appData.divcorrformdata, efileData.divCorrFormData);
  compareField('recipient.intcorrformdata', appData.intcorrformdata, efileData.intCorrFormData);
  compareField('recipient.form1098t', appData.form1098T, efileData.form1098T);
  compareField('recipient.form1098corrformdata', appData.form1098corrformdata, efileData.form1098CorrFormData);
  compareField('recipient.rcorrformdata', appData.rcorrformdata, efileData.rCorrFormData);
  compareField('recipient.w2gformdata', appData.w2gformdata, efileData.w2GFormData);
  compareField('recipient.patrformdata', appData.patrformdata, efileData.patrFormData);
  compareField('recipient.patrcorrformdata', appData.PatrCorrformdata, efileData.form1099patrCorrFormData);
  compareField('recipient.form1098e', appData.form1098E, efileData.form1098E);
  compareField('recipient.form1099sa', appData.form1099SA, efileData.form1099SA);
  compareField('recipient.bcorrformdata', appData.bcorrformdata, efileData.bCorrFormData);
  compareField('recipient.kcorrformdata', appData.kCorrFormData, efileData.kCorrFormData);
  compareField('recipient.form1099oid', appData.form1099oid, efileData.form1099OID);
  compareField('recipient.form1099q', appData.form1099Q, efileData.form1099Q);
  compareField('recipient.form1099qcorrformdata', appData.form1099QCorrFormData, efileData.form1099QCorrFormData);
  compareField('recipient.form3921', appData.form3921, efileData.form3921);
  compareField('recipient.form3922', appData.form3922, efileData.form3922);
  compareField('recipient.scorrformdata', appData.scorrformdata, efileData.sCorrFormData);
  compareField('recipient.ccorrformdata', appData.cCorrFormData, efileData.cCorrFormData);
  compareField('recipient.tcorrformdata', appData.TCorrFormData, efileData.tCorrFormData);
  compareField('recipient.form3921corrformdata', appData.form3921corrformdata, efileData.form3921CorrFormData);
  compareField('recipient.form3922corrformdata', appData.form3922CorrFormData, efileData.form3922CorrFormData);
  compareField('recipient.form1099a', appData.form1099A, efileData.form1099A);
  compareField('recipient.ltcformdata', appData.ltcFormData, efileData.ltcFormData);
  compareField('recipient.form1042sdata', appData.form1042SData, efileData.form1042SData);
  compareField('recipient.form1099gcorrformdata', appData.form1099GCorrFormData, efileData.form1099GCorrFormData);
  compareField('recipient.form1099oidcorrformdata', appData.form1099oidCorrFormData, efileData.form1099OIDCorrFormData);
  compareField('recipient.form1042scorrformdata', appData.form1042SCorrFormData, efileData.form1042SCorrFormData);
  compareField('recipient.form1099sacorrformdata', appData.form1099sacorrformdata, efileData.form1099SAcorrFormdata);
  compareField('recipient.w2prformdata', appData.w2prformdata, efileData.w2PRFormData);
  compareField('recipient.formw2gcorrformdata', appData.formw2gCorrFormData, efileData.formw2gCorrFormData);
  compareField('recipient.form1099ltccorrformdata', appData.form1099ltcCorrFormData, efileData.form1099LTCCorrFormData);
  compareField('recipient.form1099acorrformdata', appData.form1099aCorrFormData, efileData.form1099ACorrFormData);
  compareField('recipient.form5498esacorrformdata', appData.form5498ESACorrFormData, efileData.form5498ESACorrFormData);
  compareField('recipient.form5498sacorrformdata', appData.form5498saCorrFormData, efileData.form5498SACorrFormData);
  compareField('recipient.form5498corrformdata', appData.form5498corrformdata, efileData.form5498CorrFormData);
  compareField('recipient.form1098f', appData.form1098f, efileData.form1098F);
  compareField('recipient.form1099qa', appData.form1099qa, efileData.form1099QA);
  compareField('recipient.form1098ecorrformdata', appData.form1098eCorrFormData, efileData.form1098ECorrFormData);




  // Address fields
  compareField('recipient.usAddress.address1', appAddress.address1, efileAddress.address1);
  compareField('recipient.usAddress.address2', appAddress.address2, efileAddress.address2);
  compareField('recipient.usAddress.city', appAddress.city, efileAddress.city);
  compareField('recipient.usAddress.state', appAddress.state, efileAddress.state);
  compareField('recipient.usAddress.zipCd', appAddress.zipcd, efileAddress.zipCd);

  // NEC Form fields
  compareField('necFormData.b1NEC', appNec.b1nec, efileNec.b1NEC);
  compareField('necFormData.accountNumber', appNec.accountnumber, efileNec.accountNumber);
  compareField('necFormData.is2ndTINnot', appNec.is2ndtinnot, efileNec.is2ndTINnot);
  compareField('necFormData.isFATCA', appNec.isfatca, efileNec.isFATCA);
  compareField('necFormData.b4FedTaxWH', appNec.b4fedtaxwh, efileNec.b4FedTaxWH);
  compareField('necFormData.b2PayerMadeDirectSalesTotaling5000', appNec.b2payermadedirectsalestotaling5000, efileNec.b2PayerMadeDirectSalesTotaling5000);


  // console.log("Mismatches found:", mismatches.length);
  // console.log(mismatches);
  return mismatches;
}
module.exports = {
  compareJsonToJson,
};
