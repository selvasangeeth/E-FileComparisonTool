const axios = require('axios');

const generateJwt = async (req, res) => {

    try {
        const { EmailAddress, Password, Gcaptcha, RandomStateCode, RequestUserEmail, PartnershipType, VisitorId, RequestId } = req.body;
        if (!EmailAddress || !Password) {
            return res.status(400).json({ error: "EmailAddress and Password are required." });
        }
        const response = await axios.post(
            "https://tbs-authapi.stssprint.com/User/SignIn",
            {
                EmailAddress,
                Password,
                Gcaptcha,
                RandomStateCode,
                RequestUserEmail,
                PartnershipType,
                VisitorId,
                RequestId
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Referer": "https://tbs-secure1.stssprint.com"
                }
            }
        );
        // console.log("JWT generation:", response.data.JwtToken);
        return res.status(200).json({ JwtToken: response.data.JwtToken });
    } catch (error) {
        console.error("Error generating JWT:", error);
        return res.status(500).json({ msg: "Failed to generate JWT" });
    }

}

module.exports = {
    generateJwt
}