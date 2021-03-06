const express = require("express");
const router = new express.Router();
const Task = require("../database/model/taskmodel");
const auth = require("../middlewares/auth");

//show task page
router.get("/me/task", async (req, res) => {
  if (!(req.cookies.user && req.cookies['coo-key'])) return res.render("404");
  res.render("task");
});

//Create task
router.post("/me/task", auth, async (req, res) => {
  try {
    const task = await Task({
      ...req.body,
      owner : req.user._id
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Read all task
router.get("/me/mytask", auth, async (req, res) => {
  try {
    // const alltask = await Task.find({owner: req.user._id});
    await req.user.populate('mytask').execPopulate()
    res.status(200).send(req.user.mytask);
  } catch (error) {
    res.status(400).send(error);
  }
});


//Read task by id
router.get("/me/mytask/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id  , owner : req.user._id});
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//update task
router.patch("/me/task/:id", auth, async (req, res) => {
  const toUpdate = Object.keys(req.body);
  const allowUpdates = ["deleted", "completed"];
  const allUpdate = toUpdate.every((args) => allowUpdates.includes(args));
  // const allUpdate = toUpdate.includes("completed");
  if (!allUpdate) {
    return res.status(404).send({ error: "Invalid updates" });
  }
  /*   if(toUpdate.includes('taskid')){
    delete req.body.taskid
  } */
  try {
    // console.log(req.body)

    const taskid = req.params.id;
    const task = await Task.findOne({ taskid , owner : req.user._id });
    
    if (!task) return res.status(401).send();

    toUpdate.forEach((args) => {
      task[args] = req.body[args];
    });
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Delete all task
router.delete("/me/task", auth, async (req, res) => {
  try {
    const task = await Task.remove();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//delete task by id
router.delete("/me/task/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOneAndDelete({ _id , owner : req.user._id});
    if (!task){
      res.status(404).send();
    } 
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
