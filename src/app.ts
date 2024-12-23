import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { connectToDatabase } from "./Database/connection";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));

// app.use("/", indexRoute);
connectToDatabase();
app.listen(process.env.PORT, () =>
  console.log(`Express is listening at PORT: ${process.env.PORT}`)
);
