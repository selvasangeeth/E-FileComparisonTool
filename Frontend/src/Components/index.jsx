import React, { useState } from "react";
import axios from "../Axios/axios";
import "../Styles/Compare.css";

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

  const handleGenerateJWT = async () => {
    if (!email || !password) {
      alert("Please enter Email and Password");
      return;
    }
    setJwtLoading(true);
    try {
      const res = await axios.post("/api/generate-jwt", {
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
      const res = await axios.post("/compare/csv-json", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log("CSV vs Application JSON Results:", res.data.mismatches);
      setCsvVsAppResult(res.data.mismatches || []);
      setAppVsEfileResults([]);
      setEfileCompared(false);
      setComparing(false);
    } catch (err) {
      alert("Comparison with Application JSON failed");
      console.error(err);
    }
  };

  const handleCompareAllEfile = async () => {
    const returnIds = csvVsAppResult
      .map((item) => item.returnId)
      .filter((id) => !!id);

    if (!token || !appOrderId || returnIds.length === 0) {
      alert("Missing token, App Order ID, or return IDs");
      return;
    }
    setEfileComparing(true);

    try {
      const res = await axios.post("/compare/appjson-efilejson", {
        token,
        appOrderId,
        returnIds,
      });

      // console.log("E-File JSON Comparison Results:", res.data.mismatches);
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
      if (!map.has(item.returnId)) {
        map.set(item.returnId, {
          csvApp: [],
          appEfile: [],
          rowNumber: item.rowNumber,
          msg: item.msg || "",
          row: item.row || "",
        });
      }
      map.get(item.returnId).csvApp = item.issues || [];
      map.get(item.returnId).rowNumber = item.rowNumber;
      map.get(item.returnId).msg = item.msg || "";
    });

    appVsEfileResults.forEach((item) => {
      if (!map.has(item.returnId)) {
        map.set(item.returnId, {
          csvApp: [],
          appEfile: [],
          rowNumber: null,
          msg: "",
        });
      }
      map.get(item.returnId).appEfile = (item.issues || []).flat();
    });

    return Array.from(map.entries()).map(([returnId, data]) => ({
      returnId,
      rowNumber: data.rowNumber,
      csvAppIssues: data.csvApp,
      appEfileIssues: data.appEfile,
      msg: data.msg,
      row: data.row || {},
    }));
  };

  return (
    <div className="container">
      <h2>E-File Comparison Tool</h2>

      <div className="form" style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleGenerateJWT} disabled={jwtLoading}>
          {jwtLoading ? "Generating JWT..." : "Generate JWT"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        {/* <p><strong>JWT TOKEN</strong></p>
        <input
          type="text"
          placeholder="Bearer Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        /> */}
        <p><strong>APP ORDER ID</strong></p>
        <input
          type="text"
          placeholder="App Order ID"
          value={appOrderId}
          onChange={(e) => setAppOrderId(e.target.value)}
          required
        />
        <button type="submit">{Comapring ? "Comparing..." : "Compare Csv vs Application JSON"}</button>
      </form>

      {csvVsAppResult.length > 0 && (
        <button style={{ marginTop: "20px" }} onClick={handleCompareAllEfile}>
          {efileComapring ? "Comparing..." : "Compare Application JSON with E-File JSON"}
        </button>
      )}

      <h3>Comparison Results</h3>
      {combinedResults().length === 0 ? (
        <p>Not yet Compared</p>
      ) : (
        combinedResults().map(({ returnId, rowNumber, csvAppIssues, appEfileIssues, msg, row }, i) => {
          const recipientTinType = row?.["Recipient type of TIN (1=EIN 2=SSN 3=ITIN 4=ATIN 5=TIN not provided)*"];
          const recipientName =
            recipientTinType === "2" || recipientTinType === "3" || recipientTinType === "4"
              ? `${row?.["Recipient first name (if the recipient TIN is SSN, ATIN or ITIN)*"] || ""} ${row?.["Recipient last name (if the recipient TIN is SSN, ATIN or ITIN)*"] || ""}`.trim()
              : row?.["Recipient name (if the recipient TIN is EIN or TIN not provided)*"] || "";

          return (
            <div key={`combined-${returnId}-${i}`} className="result" style={{ marginBottom: "2rem" }}>
              {rowNumber !== null && <p><strong>Row Number:</strong> {rowNumber}</p>}
              <p><strong>Return ID:</strong> {returnId}</p>
              <p><strong>Recipient Name:</strong> {recipientName || "N/A"}</p>

              <h4>CSV vs Application JSON Mismatches</h4>
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
                  <h4>Application JSON vs E-File JSON Mismatches</h4>
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
  );
};

export default Index;
