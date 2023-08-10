const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
// const date = new Date();
const port = 3000;
var newI = [];
var newWorkI = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURL = 'mongodb://0.0.0.0:27017/todolistDB';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please check your entry"]
    }
});

// const workItemSchema = new mongoose.Schema({
//     name: {
//       type: String,
//       required: [true, "Please check your entry"]
//     }
// });

const Item = mongoose.model('Item', itemSchema);
const WorkItem = mongoose.model('WorkItem',itemSchema);

const item1 = new Item({
    name: "Get new health card"
});

const item2 = new Item({
    name: "Go for groccery shopping"
});

const item3 = new Item({
    name: "Apply to Sobey's"
});

const item4 = new Item({
    name: "Apply to Sobey's"
});
const defaultItems = [item1,item2, item3];
const defaultWorkItems = [item4];



var newItem = "";
var newWorkItem = "";
// const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// let day = weekday[date.getDay()];
// let currentMonth = month[date.getMonth()];
// let currentDay = date.getDay();
// let currentD = day+", "+currentMonth.toString()+" "+currentDay.toString();


app.get("/", async function(req, res){
  newI= await Item.find({});
  if(newI.length===0){
    await Item.insertMany(defaultItems);
    console.log("added default items");
    res.redirect("/");
  }
  else{
    res.render("index.ejs",{newItems:newI});
  }
});
app.get("/work", async function(req, res){
  newWorkI= await WorkItem.find({});
  if(newWorkI.length===0){
    await WorkItem.insertMany(defaultWorkItems);
    console.log("added default work items");
    res.redirect("/work");
  }
  else{
    res.render("work.ejs",{newWorkItems:newWorkI});
  }
});

app.post("/", async (req, res) => {
  newItem=req.body["item"];
  newWorkItem =req.body["workItem"];
  if(newItem){
    const item1 = new Item({
        name: newItem
    });
    await Item.insertMany(item1);
    newItem="";
    res.redirect("/");
  };
  if(newWorkItem){
    const item1 = new WorkItem({
        name: newWorkItem
    });
    await WorkItem.insertMany(item1);
    newWorkItem="";
    res.redirect("/work");
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
