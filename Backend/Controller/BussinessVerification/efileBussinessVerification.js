function compareApplicationBusinessWithJson(appJson, efileAppJson) {

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

    const appSubDetails = appJson.submissiondetails || {};
    const efileSubDetails = efileAppJson.SubmissionDetails|| {};

    const efileData = efileAppJson.ReturnData || {};

    const appBusiness = appData.business || {};

    const efileBusiness = efileData.business || {};

    const appBusinessUsAddress = appBusiness.usaddress || {};
    const efileBusinessUsAddress = efileBusiness.usAddress || {};

    const compareField = (label, val1, val2) => {
        const normalize = (v) => (v === null) ? '' : v.toString().trim();

        const displayVal1 = normalize(val1);
        const displayVal2 = normalize(val2);

        

        if (displayVal1 !== displayVal2) {
            // console.log(`Comparing ${label}: App Value: ${displayVal1}, E-File Value: ${displayVal2}`);
            mismatches.push({
                field: label,
                appValue: val1,
                efileValue: val2,
            });
        }
    };


    //Bussiness Details
    compareField("Business Id", appBusiness.businessid, efileBusiness.businessId);
    compareField("Business Name", appBusiness.businessnm, efileBusiness.businessNm);
    compareField("Trade Name", appBusiness.tradenm, efileBusiness.tradeNm);
    compareField("TIN Type", appBusiness.tintype, efileBusiness.tinType);
    compareField("TIN", appBusiness.tin, efileBusiness.tin);
    compareField("Email", appBusiness.email, efileBusiness.email);
    compareField("Contact Name", appBusiness.contactnm, efileBusiness.contactNm);
    compareField("Phone", appBusiness.phone, efileBusiness.phone);
    compareField("Phone Extension", appBusiness.phoneextn, efileBusiness.phoneExtn);
    compareField("Fax", appBusiness.fax, efileBusiness.fax);
    compareField("Business Type", appBusiness.businesstype, efileBusiness.businessType);
    compareField("Signing Authority", appBusiness.signingauthority, efileBusiness.signingAuthority);
    compareField("Kind Of Employer", appBusiness.kindofemployer, efileBusiness.kindOfEmployer);
    compareField("Kind Of Payer", appBusiness.kindofpayer, efileBusiness.kindOfPayer);
    compareField("Is Business Terminated", appBusiness.isbusinessterminated, efileBusiness.isBusinessTerminated);
    compareField("Is Foreign", appBusiness.isforeign, efileBusiness.isForeign);
    compareField("Business GIIN", appBusiness.businessgiin, efileBusiness.businessGIIN);
    compareField("Business CH3 Code", appBusiness.businessch3code, efileBusiness.businessCh3Code);
    compareField("Business CH4 Code", appBusiness.businessch4code, efileBusiness.businessCh4Code);
    compareField("Business FTIN", appBusiness.businessftin, efileBusiness.businessFTIN);
    compareField("Business Country Code", appBusiness.businessctrycode, efileBusiness.businessCtryCode);
    compareField("Department Title", appBusiness.deptTitle, efileBusiness.deptTitle);
    compareField("Cease of Operation Date", appBusiness.ceaseofoprdate, efileBusiness.ceaseOfOprDate);
    compareField("Iris Submission Id", appBusiness.irisSubmissionId, efileBusiness.IrisSubmissionId);
    compareField("Is Partnership Reporting", appBusiness.ispartnershipreporting, efileBusiness.isPartnershipReporting);
    compareField("Foreign Address", appBusiness.foreignaddress, efileBusiness.foreignAddress);
    compareField("First Name", appBusiness.firstNm, efileBusiness.firstNm);
    compareField("Middle Name", appBusiness.middleNm, efileBusiness.middleNm);
    compareField("Last Name", appBusiness.lastNm, efileBusiness.lastNm);
    compareField("Suffix", appBusiness.suffix, efileBusiness.suffix);

    //Business Address
    compareField("Business Address Line 1", appBusinessUsAddress.address1, efileBusinessUsAddress.address1);
    compareField("Business Address Line 2", appBusinessUsAddress.address2, efileBusinessUsAddress.address2);
    compareField("Business City", appBusinessUsAddress.city, efileBusinessUsAddress.city);
    compareField("Business State", appBusinessUsAddress.state, efileBusinessUsAddress.state);
    compareField("Business Zip", appBusinessUsAddress.zipcd, efileBusinessUsAddress.zipCd);


    //Submission Details
    compareField("Product Id", appSubDetails.productid, efileSubDetails.ProductId);
    compareField("User Email", appSubDetails.useremail, efileSubDetails.UserEmail);
    compareField("appOrderId", appSubDetails.apporderid, efileSubDetails.AppOrderId);
    compareField("TaxYear", appSubDetails.taxyear, efileSubDetails.taxYear);
    compareField("isFederalFiling", appSubDetails.isfederalfiling, efileSubDetails.IsFederalFiling);
    compareField("isStateFiling", appSubDetails.isstatefiling, efileSubDetails.IsStateFiling);
    compareField("isPostal", appSubDetails.ispostal, efileSubDetails.IsPostal);
    compareField("isUspsVerification", appSubDetails.isuspsverification, efileSubDetails.IsUspsVerification);
    compareField("isPdf", appSubDetails.ispdf, efileSubDetails.isPDF);
    compareField("isschedulefiling", appSubDetails.isschedulefiling, efileSubDetails.IsScheduleFiling);
    compareField("ScheduleFiling", appSubDetails.Schedulefiling, efileSubDetails.ScheduleFiling);
    compareField("filingType", appSubDetails.filingType, efileSubDetails.filingType);
    compareField("irisUtId", appSubDetails.irisUtId, efileSubDetails.IrisUtId);
    compareField("irisReceiptId", appSubDetails.irisReceiptId, efileSubDetails.IrisReceiptId);
    compareField("ReturnType", appSubDetails.ReturnType, efileSubDetails.ReturnType);
    compareField("Istinfinalstatus", appSubDetails.Istinfinalstatus, efileSubDetails.IsTinFinalStatus);



    return mismatches;

}
module.exports = {
    compareApplicationBusinessWithJson
};