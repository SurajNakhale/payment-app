import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/index.js";
import { DB_URL } from "./config.js";


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/v1", router)


async function main() {
    await mongoose.connect(DB_URL);
    console.log("mongodb connected successfully");


    app.listen(3000, () => {
        console.log("server running on http://localhost:3000")
    })
}

main();