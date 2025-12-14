import express from "express";
import path from "path";
import { ENV } from './config/env.ts'
import { connectDB } from "./config/db.ts";

import { clerkMiddleware } from '@clerk/express'

import { serve } from "inngest/express"

import { functions, inngest } from "./config/inngest.ts";

const app = express();


app.use(express.json())
app.use(clerkMiddleware( ))

app.use("/api/inngest", serve({ client: inngest, functions: functions  }))

const __dirname = path.resolve() 

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success " })
})

// make ready for deployment

if(ENV.NODE_ENV  === 'production'){
    app.use(express.static(path.join(__dirname, "../admin/dist")))

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    })
}

const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("Server is up")
    })
}

startServer()