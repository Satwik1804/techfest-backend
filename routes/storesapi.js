import express from "express";

import Store from "../models/stores.js";

const router = express.Router();

router.get("/fetchAllItems", async (req, res) => {
    try {
        console.log("Fetching all Items");
        const stores = await Store.find({});
        res.json(stores);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/addItem", async (req, res) => {
    try {
        const stores = new Store(req.body);
        const savedStore = await stores.save();
        res.json(savedStore);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.put("/updateItem/:id", async (req, res) => {
    try {
        const { storeId, storeImage, storePrice } = req.body;
        const newStore = {};
        if(storeImage){newStore.storeImage = storeImage};
        if(storePrice){newStore.storePrice = storePrice};

        let store = Store.findById(req.params.id);
        if(!store) { res.status(404).send("Not Found") }

        store = await Store.findByIdAndUpdate(req.params.id, {$set: newStore}, {new:true})
        res.json({store});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.delete("/deleteItem/:id", async (req, res) => {
    try {
        let item = await Store.findById(req.params.id);
        if(!item) { return res.status(404).send("Not Found") }
        item = await Store.findByIdAndDelete(req.params.id);
        res.json({event: item});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

export default router;