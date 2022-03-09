const cron = require("node-cron");
const express = require("express");
const fetch = require("node-fetch");
// const fetch = require("node-fetch");
// import fetch from "node-fetch";
// import {fetch} from "node-fetch";
require("dotenv").config();

const { Api, JsonRpc, RpcError } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const { TextEncoder, TextDecoder } = require("util");

const defaultPrivateKey = process.env.PRIVATE_KEY;
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc(process.env.RPC, { fetch });
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

app = express();

console.log("Program Executing...");

const mines = [
  {
    mineId: 0,
  },
];

cron.schedule(process.env.CRON, async function () {
  try {
    if (process.env.ACTIVE == "TRUE") {
      for (let index = 0; index < mines.length; index++) {
        const element = mines[index];
        const result = await api.transact(
          {
            actions: [
              {
                account: process.env.CONTRACT_NAME,
                name: "recyclem",
                authorization: [
                  {
                    actor: process.env.CONTRACT_NAME,
                    permission: process.env.PERMISSION,
                  },
                ],
                data: {
                  mine_id: element.mineId,
                },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        );

        console.log("Successfully ran Cycle");
      }
    }
  } catch (exp) {
    console.log("Something went wrong");
    console.log(exp);
  }
});
app.listen(process.env.PORT)
