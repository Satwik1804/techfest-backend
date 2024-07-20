import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema({
    eventId:{
        type: Number,
        required: true,
        unique:true
    },

    eventImage:{
        type: String,
        required: true
    },
    eventName:{
        type: String,
        required: true
    },
    eventDescription:{
        type: String,
        required: true
    },
    eventDate:{
        type:Date,
        default: Date.now
    },
    eventVenue:{
        type:String,
        required:true
    }
})

const event = mongoose.model("events", eventSchema)
export default event