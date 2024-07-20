import mongoose from "mongoose";

const { Schema } = mongoose;

const workshopSchema = new Schema({
    rollNo:{
        type: Number,
        required: true,
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,   
    },
    workshopName:{
        type: String,
        required: true,
    },
    workshopId:{
        type: Number,
        required: true
    }
})

const workshopEnrolledStudent = mongoose.model("workshopUsers", workshopSchema)
export default workshopEnrolledStudent;