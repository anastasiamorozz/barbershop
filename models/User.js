const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    phone: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: [true, "Your password is required"]
    },
    numberOfVisits: {
        type: Number
    },
    role: {
        type: String,
        enum: ["user", "barber", "admin"], 
        default: "user" // Роль за замовчуванням при реєстрації
    },
    photo: {
        type: String // Зберігається шлях до файлу або URL фото користувача
    }
});

UserSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("users", UserSchema);
module.exports = User;
