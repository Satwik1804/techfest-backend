import express from "express";

import Speaker  from "../models/speakers.js";

const router = express.Router();

router.get("/fetchAllSpeakers", async (req, res) => {
    try {
        console.log("Fetching all Items");
        const speaker = await Speaker.find({});
        res.json(speaker);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/add", async (req, res) => {
    try {
        const speaker = new Speaker(req.body);
        const saveSpeaker = await speaker.save();
        res.json(saveSpeaker);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
export default router;
