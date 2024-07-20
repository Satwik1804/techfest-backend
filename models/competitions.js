import mongoose from "mongoose";

const { Schema } = mongoose;

const competitionSchema = new Schema({
    competitionImage:{
        type: String,
        required: true
    },
    competitionId:{
        type: Number,
        required: true,
        unique:true
    },
    competitionName:{
        type: String,
        required: true
    },
    competitionDescription:{
        type: String,
        required: true
    },
    competitionPrice:{
        type: Number,
        required: true
    },
    competitionDate:{
        type:Date,
        required: true
    },
    clubName:{
        type:String,
        required:true,
    },
    competitionVenue:{
        type:String,
        required:true
    }
})

const competition = mongoose.model("competitions", competitionSchema)
export default competition