const express = require("express");
const app = express();
app.use(express.json());

const { dataRole, dataUser } = require("./data2");

let roles = [...dataRole];
let users = [...dataUser];


// ================= ROLE CRUD =================

// GET all roles
app.get("/roles", (req, res) => {
    res.json(roles);
});

// GET role by id
app.get("/roles/:id", (req, res) => {
    const role = roles.find(r => r.id === req.params.id);
    if (!role) return res.status(404).json({message:"Role not found"});
    res.json(role);
});

// CREATE role
app.post("/roles", (req, res) => {
    const newRole = {
        id: "r" + (roles.length + 1),
        name: req.body.name,
        description: req.body.description,
        creationAt: new Date(),
        updatedAt: new Date()
    };

    roles.push(newRole);
    res.status(201).json(newRole);
});

// UPDATE role
app.put("/roles/:id", (req, res) => {
    const role = roles.find(r => r.id === req.params.id);
    if (!role) return res.status(404).json({message:"Role not found"});

    role.name = req.body.name || role.name;
    role.description = req.body.description || role.description;
    role.updatedAt = new Date();

    res.json(role);
});

// DELETE role
app.delete("/roles/:id", (req, res) => {
    roles = roles.filter(r => r.id !== req.params.id);
    res.json({message:"Role deleted"});
});


// ================= USER CRUD =================

// GET all users
app.get("/users", (req, res) => {
    res.json(users);
});

// GET user by username
app.get("/users/:username", (req, res) => {
    const user = users.find(u => u.username === req.params.username);
    if (!user) return res.status(404).json({message:"User not found"});
    res.json(user);
});

// CREATE user
app.post("/users", (req, res) => {

    const role = roles.find(r => r.id === req.body.roleId);

    if (!role) return res.status(400).json({message:"Role not found"});

    const newUser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        status: true,
        loginCount: 0,
        role: role,
        creationAt: new Date(),
        updatedAt: new Date()
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// UPDATE user
app.put("/users/:username", (req, res) => {

    const user = users.find(u => u.username === req.params.username);
    if (!user) return res.status(404).json({message:"User not found"});

    user.email = req.body.email || user.email;
    user.fullName = req.body.fullName || user.fullName;
    user.updatedAt = new Date();

    res.json(user);
});

// DELETE user
app.delete("/users/:username", (req, res) => {
    users = users.filter(u => u.username !== req.params.username);
    res.json({message:"User deleted"});
});


// ================= CUSTOM API =================

// /roles/:id/users
app.get("/roles/:id/users", (req, res) => {

    const roleUsers = users.filter(
        u => u.role.id === req.params.id
    );

    res.json(roleUsers);
});


// ================= SERVER =================

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});