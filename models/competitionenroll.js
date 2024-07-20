import mongoose from "mongoose";

const { Schema } = mongoose;

const competitionSchema = new Schema({
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
    competitionName:{
        type: String,
        required: true,
    },
    competitionId:{
        type: Number,
        required: true
    }
})

const competitionEnrolledStudent = mongoose.model("competitionUsers", competitionSchema)
export default competitionEnrolledStudent;