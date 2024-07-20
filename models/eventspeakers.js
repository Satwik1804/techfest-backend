import mongoose from "mongoose";

const { Schema } = mongoose;

const speakerSchema = new Schema({
    speakerName:{
        type: String,
        required: true
    },
    speakerImage:{
        type: String,
        required: true
    },
    speakerDesignation:{
        type:String,
        required:true
    },
    eventId:{
        type: Number,
        required: true
    },
    eventName:{
        type: String,
        required: true
    }
})

const eventSpeaker = mongoose.model("eventSpeakers", speakerSchema)
export default eventSpeaker;