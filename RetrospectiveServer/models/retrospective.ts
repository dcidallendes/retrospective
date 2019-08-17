import mongoose, { Schema, Document } from 'mongoose';

export interface Retrospective extends Document{
    name: String;
    date: Date;
}

// Declare the Schema of the Mongo model
var retrospectiveSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    date:{
        type: Date ,
        required:true,
    }
});

//Export the model
module.exports = mongoose.model<Retrospective>('Retrospective', retrospectiveSchema);