import { Schema, model } from "mongoose";

const AdminSchema = Schema({
    name: {
        type: String,
        required: [true, "Name  is required"],
        maxlength: [25, "Name is more than 25 characters"]
    },
    surname: {
        type: String,
        required: [true, "Last name is required"],
        maxlength: [25, "Last name is more than 25 characters"]
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8
    },
    role: {
        type: String,
        enum: ["ADMIN"],
        default: "ADMIN"
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

AdminSchema.methods.toJSON = function () {
    const { __v, password, _id, ...admin } = this.toObject();
    admin.uid = _id;
    return admin;
}

export default model('Admin', AdminSchema);