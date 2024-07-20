import mongoose from "mongoose";
const { Schema } = mongoose;
const speakerSchema=new Schema({
    speakerId:{
        type:Number,
        required:true
    },
    speakerUrl:{
        type:String,
        required:true

    },
    speakerName:{
       type:String,
       required:true
    },
    speakerDesignation:{
        type:String,
        required:true
    },
    speakerCompany:{
        type:String,
        required:true,
    },
    eventName:{
        type:String,
        required:true
    }
})
const speaker = mongoose.model("speaker", speakerSchema);
export default speaker;