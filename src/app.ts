import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectToDatabase } from "./Database/connection";
import indexRouter from "./Routes/indexRoute";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

app.use("/", indexRouter);
connectToDatabase();
app.listen(process.env.PORT, () =>
  console.log(`Express is listening at PORT: ${process.env.PORT}`)
);
