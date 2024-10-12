// src/models/User.js
import mongoose, { Schema } from 'mongoose'; 

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: [], 
  },
    createdAt: {
    type: Date,
    default: Date.now,

  },
  isactive:{
    type:Boolean,
    default:true,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);