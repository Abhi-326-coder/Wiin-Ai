import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        prompt : {
            type : String,
            required : true,
            trim : true,
        },
        imageUrl : {
            type : String,
            default : null,
        },
        
    }
)

export default mongoose.model("Image", imageSchema)