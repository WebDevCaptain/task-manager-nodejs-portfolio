const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const JWT_SECRET = process.env.JWT_SECRET;

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Lauri",
  email: "lauri@gmail.com",
  password: "1234567890",
  age: 19,
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "DT",
  email: "dt.22@gmail.com",
  password: "1234567890",
  age: 19,
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First Test Task",
  owner: userOneId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second Test Task",
  completed: true,
  owner: userOneId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third Test Task",
  completed: true,
  owner: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOne,
  userOneId,
  setupDatabase,
  userTwo,
  userTwoId,
  taskOne,
  taskThree,
  taskTwo,
};
