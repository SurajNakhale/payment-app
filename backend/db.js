import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String},
    firstname: {type: String},
    lastname: {type: String}
})

export const User = mongoose.model('User', userSchema);


const accountSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    balance: {type: Number}
})


export const Account = mongoose.model('Account', accountSchema);