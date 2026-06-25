const axios = require("axios");
const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const app = express();

const LOG_DIR = path.join(__dirname, "logs");

fs.ensureDirSync(LOG_DIR);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/collect", async (req, res) => {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
        req.socket.remoteAddress;

    try {

        const response = await axios.get(`https://ipwho.is/${ip}`);

        const log = {

            timestamp: new Date().toISOString(),
                
            request: {
                ip,
                method: req.method,
                protocol: req.protocol,
                httpVersion: req.httpVersion
            },
        
            browser: req.body.browser,
        
            network: response.data,
        
            headers: req.headers
        
        };
        
        const filename = path.join(
            LOG_DIR,
            `${Date.now()}.json`
        );
        
        await fs.writeJson(filename, log, {
            spaces: 4
        });

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