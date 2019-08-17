import mongoose, { Schema, Document } from 'mongoose';

export interface Retrospective extends Document{
    name: String;
    code: String;
}

// Declare the Schema of the Mongo model
var retrospectiveSchema = new Schema({
    name:{
        type: String,
        required:true,
    },
    code: {
        type: String,
        unique: true
    }
});

//Export the model
export default mongoose.model<Retrospective>('Retrospective', retrospectiveSchema);