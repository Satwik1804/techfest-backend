import mongoose from "mongoose";

const { Schema } = mongoose;

const adminSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required: true
    }
})

const admin = mongoose.model("admin", adminSchema)
export default admin