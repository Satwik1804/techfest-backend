import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema({
    rollNo:{
        type: Number,
        required: true,
    
    },
    studentName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,
    },
    eventName:{
        type: String,
        required: true,
    },
    eventId:{
        type: Number,
        required: true
    }
})

const eventEnrolledStudent = mongoose.model("eventenroll", eventSchema)
export default eventEnrolledStudent;