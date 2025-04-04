require("dotenv").config();
const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3100;

const GRAFANA_URL = process.env.GRAFANA_URL || "https://vigital.grafana.net";
const API_TOKEN = process.env.GRAFANA_API_TOKEN;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  const url = `${GRAFANA_URL}${req.url}`;

  const options = {
    url,
    method: req.method,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": req.get("Content-Type") || "application/json",
    },
    body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
  };

  request(options, (error, response, body) => {
    if (error) return res.status(500).json({ error: "Internal Server Error" });
    res.status(response.statusCode).send(body);
  });
});

app.listen(PORT, () => {
  console.log(`Grafana Proxy running at http://localhost:${PORT}`);
});
