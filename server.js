const axios = require("axios");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/collect", async (req, res) => {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
        req.socket.remoteAddress;

    try {

        const response = await axios.get("https://ipwho.is/");

        res.json({
            success: true,
            request: {
                ip,
                method: req.method,
                protocol: req.protocol,
                httpVersion: req.httpVersion
            },
            network: response.data,
            headers: req.headers
        });

    } catch (err) {

        res.json({

            success: true,

            request: {
                ip,
                method: req.method,
                protocol: req.protocol,
                httpVersion: req.httpVersion
            },
        
            browser: req.body.browser,
        
            network: response.data,
        
            headers: req.headers
        
        });
    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});