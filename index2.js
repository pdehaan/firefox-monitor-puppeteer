const axios = require("axios");

const envMap = new Map();
envMap.set("prod", "https://monitor.firefox.com");
envMap.set("stage", "https://blurts-server.stage.mozaws.net");
envMap.set("dev", "https://fx-breach-alerts.herokuapp.com");

async function main(env="dev") {
  const client = axios.create({
    baseURL: envMap.get(env)
  });
  const res = await client.get("/__version__");
  console.log(res.status);
  console.log(res.data);
}

main("stage");
