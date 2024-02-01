const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Schema } = mongoose;
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/moneyDB")
  .then(() => {
    console.log("成功連結到mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

const todoSchema = new Schema({
  items: { type: String, required: true },
  time: Date,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

app.post("/todos", async (req, res) => {
  const { items, time, completed } = req.body;

  try {
    const newTodo = new Todo({
      items,
      time,
      completed,
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (e) {
    console.log(e);
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/todos/:id", async ({ params: { id } }, res) => {
  try {
    await Todo.findByIdAndDelete(id);
    res.json({ message: "已刪除" });
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000....");
});
