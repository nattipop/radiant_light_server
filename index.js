const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");

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

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})