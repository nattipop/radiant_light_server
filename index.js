const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const { Photo, Event } = require("/models");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://natvita:ccthp2ZOBD5InClT@rlcluster.e9w3anc.mongodb.net/");
const db = mongoose.connection;
db.on("error", error => console.log(error))
db.once("open", () => console.log("connected to database"))

app.get("/", cors(), async (req, res) => {
  res.send("this is working")
})

app.post("/new-photo", cors(), async (req, res) => {
  const data = req.body;
  
  if(!data.title) res.status(422).send("Photo title required");
  if(!data.photo_id) res.status(422).send("Photo id required");
  if(!data.url) res.status(422).send("Photo url required");
  if(!data.category) res.status(422).send("Photo category required");

  const photo = new Photo({
    title: data.title,
    description: data.description,
    photo_id: data.photo_id,
    url: data.url,
    category: data.category
  });
  photo.save();
  res.status(200).send("Successfully added photo")
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})