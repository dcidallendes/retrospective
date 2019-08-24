import mongoose, { Schema, Document } from 'mongoose';
import { Retrospective } from './retrospective';


export interface Note extends Document{
    content: String;
    type: Number;
    userId: String;
    votes: String[]
    retrospective: Retrospective['_id'];
}
// Declare the Schema of the Mongo model
const noteSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 500
    },
    type: {
        type: Number,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true
    },
    votes: {
        type: Array
    },
    retrospective: { type: mongoose.Schema.Types.ObjectId, ref: 'Retrospective' }
});

//Export the model
export default mongoose.model<Note>('Note', noteSchema);