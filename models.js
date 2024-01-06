const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  event_id: String,
  title: String,
  description: String,
  picture_url: String,
  date: Date,
  time: String,
  location: String
})

const PhotoSchema = new Schema({
  title: String,
  description: String,
  photo_id: String,
  url: String,
  category: String
})

exports.Photo = mongoose.model("photo", PhotoSchema);
exports.Event = mongoose.model("event", EventSchema);