import { Schema, model } from "mongoose";

export const ClientSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 8
    },
    address: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("Client", ClientSchema);