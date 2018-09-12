import express from "express";
import { PORT } from "./constant";

const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.use(express.static(__dirname + "/client"));

app.listen(PORT, () => {
  console.log(`Server started http://localhost:${PORT}`);
});

import "../server";
