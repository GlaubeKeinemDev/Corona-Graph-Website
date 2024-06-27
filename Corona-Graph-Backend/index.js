const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');
const app = express();
const client = redis.createClient();

app.listen(3000, () => {
   console.log("Server läuft")
});