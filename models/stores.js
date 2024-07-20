import mongoose from "mongoose";

const { Schema } = mongoose;

const storeSchema = new Schema({
    storeId:{
        type:Number,
        required:true
    },
    storeImage:{
        type: String,
        required: true
    },
    storePrice:{
        type: Number,
        required: true
    }

})

const store = mongoose.model("store", storeSchema)
export default store