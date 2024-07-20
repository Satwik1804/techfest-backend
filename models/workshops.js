import mongoose from "mongoose";

const { Schema } = mongoose;

const workshopSchema = new Schema({
    workshopId:{
        type: Number,
        required: true,
        unique: true
    },

    workshopImage:{
        type: String,
        required: true
    },
    workshopName:{
        type: String,
        required: true
    },
    workshopDescription:{
        type: String,
        required: true
    },
    workshopPrice:{
        type: Number,
        required: true
    },
    workshopDate:{
        type: Date,
        required: true
    },
    clubName:{
        type: String,
        required: true,
    }

})

const workshop = mongoose.model("workshops", workshopSchema)
export default workshop