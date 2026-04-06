const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/nnptudm_bt_buoi4")
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
    console.error("MongoDB connection error:", err.message);
    console.log("Server will start without database connection. Please ensure MongoDB is running.");
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


// ================= ROLE CRUD =================

// GET all roles
app.get("/roles", async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching roles", error: error.message });
    }
});

// GET users thuộc một role (đặt trước /roles/:id để tránh nhầm path)
app.get("/roles/:id/users", async (req, res) => {
    try {
        const roleExists = await Role.findOne({ id: req.params.id });
        if (!roleExists) return res.status(404).json({ message: "Role not found" });
        const roleUsers = await User.find({ "role.id": req.params.id });
        res.json(roleUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users by role", error: error.message });
    }
});

// GET role by id
app.get("/roles/:id", async (req, res) => {
    try {
        const role = await Role.findOne({ id: req.params.id });
        if (!role) return res.status(404).json({ message: "Role not found" });
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: "Error fetching role", error: error.message });
    }
});

// CREATE role
app.post("/roles", async (req, res) => {
    try {
        const roleCount = await Role.countDocuments();
        const newRole = new Role({
            id: "r" + (roleCount + 1),
            name: req.body.name,
            description: req.body.description,
            creationAt: new Date(),
            updatedAt: new Date()
        });

        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (error) {
        res.status(500).json({ message: "Error creating role", error: error.message });
    }
});

// UPDATE role
app.put("/roles/:id", async (req, res) => {
    try {
        const role = await Role.findOne({ id: req.params.id });
        if (!role) return res.status(404).json({ message: "Role not found" });

        role.name = req.body.name || role.name;
        role.description = req.body.description || role.description;
        role.updatedAt = new Date();

        const updatedRole = await role.save();
        res.json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: "Error updating role", error: error.message });
    }
});

// DELETE role
app.delete("/roles/:id", async (req, res) => {
    try {
        const deletedRole = await Role.findOneAndDelete({ id: req.params.id });
        if (!deletedRole) return res.status(404).json({ message: "Role not found" });
        res.json({ message: "Role deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting role", error: error.message });
    }
});


// ================= USER CRUD =================

// GET all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// GET user by username
app.get("/users/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

// CREATE user — roleId tùy chọn, mặc định r1; fullName/avatarUrl mặc định nếu thiếu
app.post("/users", async (req, res) => {
    try {
        const dupUser = await User.findOne({ username: req.body.username });
        if (dupUser) {
            return res.status(409).json({
                message: "Username đã tồn tại, đổi username hoặc dùng PUT để sửa / DELETE để xóa trước."
            });
        }

        const roleId = req.body.roleId || "r1";
        const role = await Role.findOne({ id: roleId });
        if (!role) return res.status(400).json({ message: "Role not found" });

        const defaultAvatar = "https://i.sstatic.net/l60Hf.png";
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName ?? "nguyenduchuy",
            avatarUrl: req.body.avatarUrl ?? defaultAvatar,
            status: req.body.status !== undefined ? Boolean(req.body.status) : true,
            loginCount: req.body.loginCount !== undefined ? Number(req.body.loginCount) : 0,
            role: {
                id: role.id,
                name: role.name,
                description: role.description
            },
            creationAt: new Date(),
            updatedAt: new Date()
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Trùng dữ liệu unique (thường là username).",
                error: error.message
            });
        }
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// UPDATE user — có thể đổi role qua roleId
app.put("/users/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.body.email !== undefined) user.email = req.body.email;
        if (req.body.fullName !== undefined) user.fullName = req.body.fullName;
        if (req.body.password !== undefined) user.password = req.body.password;
        if (req.body.avatarUrl !== undefined) user.avatarUrl = req.body.avatarUrl;
        if (req.body.status !== undefined) user.status = Boolean(req.body.status);
        if (req.body.loginCount !== undefined) user.loginCount = Number(req.body.loginCount);

        if (req.body.roleId !== undefined) {
            const role = await Role.findOne({ id: req.body.roleId });
            if (!role) return res.status(400).json({ message: "Role not found" });
            user.role = {
                id: role.id,
                name: role.name,
                description: role.description
            };
        }

        user.updatedAt = new Date();

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

// DELETE user
app.delete("/users/:username", async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ username: req.params.username });
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});


// ================= SERVER =================

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});