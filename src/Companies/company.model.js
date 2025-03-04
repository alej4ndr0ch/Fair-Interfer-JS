import { Schema, model } from "mongoose";

export const CompanySchema = Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    authorizationLevel: {
        type: String,
        enum: ["Bajo".toLowerCase(), "Medio".toLowerCase(), "Alto".toLowerCase()],
        required: true
    },
    foundationYear: {
        type: Number,
        required: true
    },
    description: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("Company", CompanySchema);
