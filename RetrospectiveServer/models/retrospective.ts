import mongoose, { Schema, Document } from 'mongoose';

export interface Retrospective extends Document{
    name: String;
    shortCode: String;
}

// Declare the Schema of the Mongo model
var retrospectiveSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    shortCode:{
        type: String ,
        required:true,
    }
});

//Export the model
export default mongoose.model<Retrospective>('Retrospective', retrospectiveSchema);