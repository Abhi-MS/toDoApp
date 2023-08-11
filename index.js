const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3030;
const _ = require("lodash");
// const date = new Date();
var newI = [];
var newWorkI = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURL = process.env.MONGODB_URL;
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please check your entry"]
    }
});

const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model("List",listSchema);

const Item = mongoose.model('Item', itemSchema);

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

var newItem = "";

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
    res.render("index.ejs",{listTitle: "Today", newItems:newI});
  }
});


app.get("/:customListName", async function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  const foundList = await List.findOne({ name: customListName }).exec();
  if(foundList){
    console.log("List already exists")
    res.render("list.ejs",{listTitle:foundList.name, newListItems:foundList.items})
  }
  else{
    const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/"+customListName);
  }

});

app.post("/", async (req, res) => {
  newItem=req.body["item"];
  // newWorkItem =req.body["workItem"];
  const listName = req.body["list"];
  const listItem = req.body["listItem"];
  console.log(listName);
  if(newItem){
    const item1 = new Item({
        name: newItem
    });
    await Item.insertMany(item1);
    newItem="";
    res.redirect("/");
  };

  if(listItem){
    const newItem = new Item({
      name:listItem
    });
    try{
      await List.updateOne({name:listName}, {$push:{items:newItem}});
        res.redirect('/' + listName);

    }catch(err){
      console.log(err);
    }
  }
});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId).exec();
    res.redirect("/")
  }
  else{
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: checkedItemId } } }
        )
            .then(function () {
                res.redirect("/" + listName);
            })
            .catch(function (err) {
                console.log(err);
            });
  }

})


app.listen(port, () => {
  console.log(`Server running on port ${PORT}`);
});
