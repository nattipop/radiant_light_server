const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  event_id: String,
  title: String,
  description: String,
  picture_url: String,
  date: String,
  event_begins: String,
  event_ends: String,
  location: String,
  expires: Date
})

const PhotoSchema = new Schema({
  title: String,
  photo_id: String,
  description: String,
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
  description: String,
  picture_url: String
});

const JoySchema = new Schema({
  message: String
})

exports.Photo = mongoose.model("photo", PhotoSchema);
exports.Event = mongoose.model("event", EventSchema);
exports.User = mongoose.model("user", UserSchema);
exports.Service = mongoose.model("service", ServiceSchema);
exports.Joy = mongoose.model("joy", JoySchema);