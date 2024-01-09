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
  photo_id: String,
  url: String,
  category: String
})

const UserSchema = new Schema({
  full_name: String,
  username: String,
  password: String,
  token: String,
})

const ServiceSchema = new Schema({
  title: String,
  service_id: String,
  price: String,
  
})

exports.Photo = mongoose.model("photo", PhotoSchema);
exports.Event = mongoose.model("event", EventSchema);
exports.User = mongoose.model("user", UserSchema);