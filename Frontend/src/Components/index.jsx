import React, { useState } from "react";
import axios from "../Axios/axios";
import "../Styles/Compare.css";
import Nav from "../Components/Nav";

const Index = () => {
  const [file, setFile] = useState(null);
  const [token, setToken] = useState("");
  const [appOrderId, setAppOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [csvVsAppResult, setCsvVsAppResult] = useState([]);
  const [appVsEfileResults, setAppVsEfileResults] = useState([]);
  const [jwtLoading, setJwtLoading] = useState(false);
  const [efileCompared, setEfileCompared] = useState(false);
  const [Comapring, setComparing] = useState(false);
  const [efileComapring, setEfileComparing] = useState(false);
  const [noCsvAppMismatches, setNoCsvAppMismatches] = useState(false);


  const handleGenerateJWT = async () => {
    if (!email || !password) {
      alert("Please enter Email and Password");
      return;
    }
    setJwtLoading(true);
    try {
      const res = await axios.post("/generate-jwt", {
        EmailAddress: email,
        Password: password,
        Gcaptcha: "",
        RandomStateCode: "",
        RequestUserEmail: "",
        PartnershipType: "",
        VisitorId: "",
        RequestId: "",
      });
      if (res.data?.JwtToken) {
        setToken(res.data.JwtToken);
        alert("JWT generated successfully!");
      } else {
        alert("JWT not returned by API");
      }
    } catch (err) {
      alert("Failed to generate JWT");
      console.error(err);
    }
    setJwtLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !token || !appOrderId) {
      alert("Please upload CSV, enter JWT Token and App Order ID");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);
    formData.append("token", token);
    formData.append("appOrderId", appOrderId);
    setComparing(true);

    try {
      // console.log(token, appOrderId)
      const res = await axios.post("/compare/csv-json", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log("CSV vs Application JSON Results:", res.data);

      if (res.data.msg === "No mismatches found") {
        alert("No mismatches found in CSV vs Application JSON comparison");
        setCsvVsAppResult([]);
        setAppVsEfileResults([]);
        setEfileCompared(false);
        setNoCsvAppMismatches(true);
        setComparing(false);
        return;
      }


      setCsvVsAppResult(res.data.mismatches || []);
      setAppVsEfileResults([]);
      setEfileCompared(false);
      setNoCsvAppMismatches(false);
      setComparing(false);
    } catch (err) {
      alert("Comparison with Application JSON failed");
      console.error(err);
    }
  };

  const handleCompareAllEfile = async () => {

    // console.log(token, appOrderId, returnIds);
    if (!token || !appOrderId) {
      alert("Missing token, App Order ID");
      return;
    }
    setEfileComparing(true);

    try {
      // console.log(token, appOrderId, returnIds);
      console.log("Comparing Application JSON with E-File JSON for App Order ID:", appOrderId);
      const res = await axios.post("/compare/appjson-efilejson", {
        token,
        appOrderId,
      });


      // console.log("E-File JSON Comparison Results:", res.data);
      if (res.data.msg === "No mismatches found") {
        alert("No mismatches found in Application JSON vs E-File JSON comparison");
        setAppVsEfileResults([]);
        setEfileCompared(true);
        setEfileComparing(false);
        return;
      }
      setAppVsEfileResults(res.data.mismatches || []);
      setEfileCompared(true);
      setEfileComparing(false);
    } catch (err) {
      alert("Failed to compare Application JSON with E-File JSON");
      console.error(err);
    }
  };

  const combinedResults = () => {
    const map = new Map();

    csvVsAppResult.forEach((item) => {
      const key = `${item.returnId}-${item.rowNumber}`;
      if (!map.has(key)) {
        map.set(key, {
          csvApp: [],
          appEfile: [],
          rowNumber: item.rowNumber,
          msg: item.msg || "",
          row: item.row || "",
          jsonData: item.jsonData || {},
          returnId: item.returnId,
        });
      }
      const data = map.get(key);
      data.csvApp = item.issues || [];
      data.msg = item.msg || "";
      data.jsonData = item.jsonData || {};
    });

    appVsEfileResults.forEach((item) => {
      // Use the same key formula
      const key = `${item.returnId}-${item.rowNumber ?? "null"}`;
      if (!map.has(key)) {
        map.set(key, {
          csvApp: [],
          appEfile: [],
          rowNumber: item.rowNumber ?? null,
          msg: "",
          jsonData: item.jsonData || {},
          returnId: item.returnId,
        });
      }
      const data = map.get(key);
      data.appEfile = (item.issues || []).flat();
      data.jsonData = item.jsonData || data.jsonData || {};
    });

    return Array.from(map.entries()).map(([key, data]) => ({
      returnId: data.returnId,
      rowNumber: data.rowNumber,
      csvAppIssues: data.csvApp,
      appEfileIssues: data.appEfile,
      msg: data.msg,
      row: data.row || {},
      jsonData: data.jsonData || {},
    }));
  };

  return (
    <>
      <Nav />
      <div className="container">
        <div className="card w-75 mb-3 mx-auto">
          <div className="card-body">
            <h5 className="card-title fw-bold " >JWT Login</h5>
            <form>
              <div className="mb-3" style={{ width: "50%" }}>
                <label htmlFor="emailInput" className="form-label fw">
                  Email
                </label>
                <input
                  id="emailInput"
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3" style={{ width: "50%" }}>
                <label htmlFor="passwordInput" className="form-label">
                  Password
                </label>
                <input
                  id="passwordInput"
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="btn generate-jwt-btn"
                type="button"
                onClick={handleGenerateJWT}
                disabled={jwtLoading}
              >
                {jwtLoading ? "Generating JWT..." : "Generate JWT"}
              </button>
            </form>
          </div>
        </div>

        <div className="card w-100 mb-4">
          <div className="card-body">
            <h4 className="card-title text-center fw-bold mb-4">Input Data</h4>

            {/* Row for inner cards */}
            <div className="row">
              {/* Left card: Upload CSV */}
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-center">Application Input data</h5>
                    <div className="mb-3">
                      <label htmlFor="formFileSm" className="form-label fw-bold">CSV File</label>
                      <input
                        className="form-control form-control-sm"
                        type="file"
                        id="formFileSm"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right card: App Order ID */}
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-center">E-File App Order ID</h5>
                    <div className="mb-3">
                      <label htmlFor="appOrderId" className="form-label fw-bold">App Order ID</label>
                      <input
                        type="text"
                        className="form-control"
                        id="appOrderId"
                        placeholder="App Order ID"
                        value={appOrderId}
                        onChange={(e) => setAppOrderId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button Centered Below Both Cards */}
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn generate-jwt-btn"
                onClick={handleSubmit}
                disabled={Comapring}
              >
                {Comapring ? "Comparing..." : "Compare CSV vs Application JSON"}
              </button>
            </div>
          </div>
        </div>

        {(csvVsAppResult.length > 0 || noCsvAppMismatches) && (
          <button className="btn generate-jwt-btn" onClick={handleCompareAllEfile}>
            {efileComapring ? "Comparing..." : "Compare Application JSON with E-File JSON"}
          </button>
        )}


        <h3 className="fw-bold">Comparison Results</h3>
        {efileCompared && appVsEfileResults.length === 0 && (
          <p>No mismatches found in Application JSON vs E-File JSON comparison</p>
        )}

        {csvVsAppResult.length === 0 && noCsvAppMismatches && !efileCompared ? (
          <p>No mismatches found in CSV vs Application JSON comparison.</p>
        ) : csvVsAppResult.length === 0 && !efileCompared ? (
          <p>Not yet Compared</p>
        ) : (
          combinedResults().map(({ returnId, rowNumber, csvAppIssues, appEfileIssues, msg, row, jsonData }, i) => {
            const recipientTinType = jsonData.tintype;
            const recipientName =
              recipientTinType === "SSN" || recipientTinType === "ATIN" || recipientTinType === "ITIN"
                ? `${jsonData.firstNm || ""} ${jsonData.middleNm || ""} ${jsonData.lastNm}`.trim()
                : jsonData.businessNm || "";

            return (
              <div key={`combined-${returnId}-${i}`} className="result" style={{ marginBottom: "2rem" }}>
                {rowNumber !== null && <p><strong>Csv Row Number:</strong> {rowNumber + 1}</p>}
                <p><strong>Return ID:</strong> {returnId}</p>
                <p><strong>Recipient Name:</strong> {recipientName || "N/A"}</p>

                <h4><strong>CSV vs Application JSON Mismatches</strong></h4>
                {csvAppIssues.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>CSV Value</th>
                        <th>Application JSON Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvAppIssues.map((issue, j) => (
                        <tr key={`csvapp-issue-${j}`}>
                          <td>{issue.field}</td>
                          <td>{String(issue.csv)}</td>
                          <td>{String(issue.json)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : msg ? (
                  <p>{msg}</p>
                ) : (
                  <p>No mismatches.</p>
                )}

                {efileCompared && (
                  <>
                    <h4><strong>Application JSON vs E-File JSON Mismatches</strong></h4>
                    {appEfileIssues.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Field</th>
                            <th>Application JSON Value</th>
                            <th>E-File JSON Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appEfileIssues.map((issue, j) => (
                            <tr key={`app-efile-issue-${j}`}>
                              <td>{issue.field}</td>
                              <td>{String(issue.appValue ?? '')}</td>
                              <td>{String(issue.efileValue ?? '')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : msg ? (
                      <p>{msg}</p>
                    ) : (
                      <p>No mismatches.</p>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Index;
