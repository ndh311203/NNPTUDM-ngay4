const mongoose = require("mongoose");
const { dataRole, dataUser } = require("./data2");

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/nnptudm_bt_buoi4")
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
    console.error("MongoDB connection error:", err.message);
    console.log("Please ensure MongoDB is installed and running on localhost:27017");
    process.exit(1);
});

// Định nghĩa Schema
const roleSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    creationAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    fullName: String,
    avatarUrl: String,
    status: { type: Boolean, default: true },
    loginCount: { type: Number, default: 0 },
    role: {
        id: String,
        name: String,
        description: String
    },
    creationAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Tạo Model
const Role = mongoose.model("Role", roleSchema);
const User = mongoose.model("User", userSchema);

async function seedDatabase() {
    try {
        // Xóa dữ liệu cũ
        await Role.deleteMany({});
        await User.deleteMany({});

        // Thêm roles
        await Role.insertMany(dataRole);
        console.log("Roles seeded successfully");

        // Thêm users
        await User.insertMany(dataUser);
        console.log("Users seeded successfully");

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();