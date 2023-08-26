const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

require('dotenv').config();

// ...

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// ...



const taskSchema = new mongoose.Schema({
    name: String,
    completed: Boolean
});

const Task = mongoose.model("Task", taskSchema);


app.get("/", async function(req, res) {
    try {
        const foundTasks = await Task.find({}).exec();
        res.render("index", { tasks: foundTasks });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/", function(req, res) {
    const taskName = req.body.newTask;
    const newTask = new Task({
        name: taskName,
        completed: false
    });
    newTask.save();
    res.redirect("/");
});
// ... (Your existing imports and code)

app.post("/delete", async function(req, res) {
    const checkedItemId = req.body.checkbox;

    try {
        await Task.findByIdAndRemove(checkedItemId).exec();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
