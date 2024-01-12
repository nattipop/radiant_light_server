if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express");
const app = express();
const port = 5000 || process.env.PORT;
const cors = require("cors");
const { Photo, Event, User, Service } = require("./models");
const jwt = require("jsonwebtoken");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

const mongoose = require("mongoose");
const { off } = require("process");
mongoose.connect("mongodb+srv://natvita:ccthp2ZOBD5InClT@rlcluster.e9w3anc.mongodb.net/");
const db = mongoose.connection;
db.on("error", error => console.log(error))
db.once("open", () => console.log("connected to database"))

app.get("/", cors(), async (req, res) => {
  res.send("this is working")
})

// PHOTOS API CALLS START
app.post("/new-photo", cors(), async (req, res) => {
  const data = req.body;
  
  if(!data.title) res.status(422).send("Photo title required.");
  if(!data.photo_id) res.status(422).send("Photo id required.");
  if(!data.url) res.status(422).send("Photo url required.");
  if(!data.category) res.status(422).send("Photo category required.");

  const photo = new Photo({
    title: data.title,
    photo_id: data.photo_id,
    url: data.url,
    category: data.category
  });
  photo.save();
  res.status(200).send("Successfully added photo.")
});

app.delete("/delete-photo/:photo_id", cors(), async (req, res) => {
  const photo_id = req.params.photo_id;

  await Photo.findOneAndDelete({ photo_id: photo_id }).then(photo => {
    if(!photo){
      res.status(404).send("Could not delete photo because it does not exist.")
    }
    
    res.status(200).send(`Photo ${photo_id} successfully deleted.`)
  })
});

app.get("/all-photos", cors(), (req, res) => {
  Photo.find({}).then((err, photos) => {
    if(err){
      return res.send(err);
    }

    if(!photos){
      return res.status(404).send("No photos to show.")
    }
    res.status(200).send(photos)
  })
});

app.get("/photos/:category", cors(), async (req, res) => {
  const category = req.params.category;

  await Photo.find({ category: category }).then(photos => {
    if(!photos){
      return res.status(404).send("No photos to show.")
    }
    
    res.status(200).send(photos)
  })
});

app.get("/photo-by-id/:photo_id", cors(), async (req, res) => {
  const photo_id = req.params.photo_id;

  await Photo.findOne({ photo_id: photo_id }).then(photo => {
    if(!photo){
      res.status(404).send("Could not find photo with that id.")
    };

    res.status(200).send(photo)
  })
});

app.put("/photos/:photo_id", cors(), (req, res) => {
  const photo_id = req.params.photo_id;
  console.log(req.body);

  if(!req.body.title) return res.status(422).send("There was an error with the format of your request. Title required.");

  if(!req.body.url) return res.status(422).send("There was an error with the format of your request. Url required.");

  if(!req.body.category) return res.status(422).send("There was an error with the format of your request. Category required.");

  Photo.findOneAndUpdate({ photo_id: photo_id }, {"$set": {
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
    category: req.body.category
  }}, { "new": true }).then((err, photo) => {
    if(err) {
      return res.send(err)
    }
    res.status(200).send(photo)
  })
})
// PHOTOS API CALLS END

// EVENTS API CALLS START
app.post("/new-event", cors(), async (req, res) => {
  const data = req.body;
  
  if(!data.title) res.status(422).send("Event title required.");
  if(!data.event_id) res.status(422).send("Event id required.");
  if(!data.description) res.status(422).send("Event description required.");
  if(!data.picture_url) res.status(422).send("Event photo url required.");
  if(!data.date) res.status(422).send("Event date required.");
  if(!data.time) res.status(422).send("Event time required.");
  if(!data.location) res.status(422).send("Event location required.");


  const event = new Event({
    event_id: data.event_id,
    title: data.title,
    description: data.description,
    picture_url: data.picture_url,
    date: data.date,
    time: data.time,
    location: data.location
  });

  event.save();
  res.status(200).send("Successfully added event.")
});

app.get("/all-events", cors(), (req, res) => {
  Event.find({}).then((err, events) => {
    if(err){
      return res.send(err);
    }
  
    if(!events){
      return res.status(404).send("No events to show.")
    }
    res.status(200).send(events)
  })
});

app.get("/event-by-id/:event_id", cors(), async (req, res) => {
  const event_id = req.params.event_id;

  await Event.findOne({ event_id: event_id }).then(event => {
    if(!event){
      res.status(404).send("Could not find event with that id.")
    }

    res.status(200).send(event);
  })
});

app.delete("/delete-event/:event_id", cors(), async (req, res) => {
  const event_id = req.params.event_id;

  await Event.findOneAndDelete({ event_id: event_id }).then(event => {
    if(!event) {
      res.status(404).send("Could not delete that event because it does not exist.")
    }

    res.status(200).send(`Event ${event_id} successfully deleted.`)
  })
});

app.put("/events/:event_id", cors(), (req, res) => {
  const event_id = req.params.event_id;
  console.log(req.body);
  if(!req.body.title) return res.status(422).send("There was an error with the format of your request. Title required.");

  if(!req.body.description) return res.status(422).send("There was an error with the format of your request. Description required.");

  if(!req.body.date) return res.status(422).send("There was an error with the format of your request. Date required.");

  if(!req.body.time) return res.status(422).send("There was an error with the format of your request. Time required.");

  if(!req.body.location) return res.status(422).send("There was an error with the format of your request. Location required.");

  if(!req.body.expires) return res.status(422).send("There was an error with the format of your request. Expiration required.");

  Event.findOneAndUpdate({ event_id: event_id }, {"$set": {
    title: req.body.title,
    description: req.body.description,
    picture_url: req.body.picture_url,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    expires: req.body.expires
  }}, { "new": true }).then((err, event) => {
    if(err) {
      return res.send(err)
    }
    res.status(200).send(event);
  })
});
// EVENTS API CALLS END

// SERVICES API CALLS START
app.post("/new-service", cors(), async (req, res) => {
  const data = req.body;
  
  if(!data.title) res.status(422).send("Service title required.");
  if(!data.service_id) res.status(422).send("Service id required.");
  if(!data.price) res.status(422).send("Service price required.");

  const service = new Service({
    title: data.title,
    service_id: data.service_id,
    price: data.price,
    description: data.description,
    picture_url: data.picture_url
  });

  service.save()
  res.status(200).send("Successfully added service.")
});

app.get("/all-services", cors(), (req, res) => {
  Service.find({}).then((err, services) => {
    if(err){
      return res.send(err);
    }
  
    if(!services){
      return res.status(404).send("No services to show.")
    }
    res.status(200).send(services)
  })
});

app.get("/service-by-id/:service_id", cors(), async (req, res) => {
  const service_id = req.params.service_id;

  await Service.findOne({ service_id: service_id }).then(service => {
    if(!service){
      return res.status(404).send("Could not find service with that id.")
    }

    res.status(200).send(service);
  })
});

app.put("/services/:service_id", cors(), (req, res) => {
  const service_id = req.params.service_id;
  console.log(req.body);

  if(!req.body.title) return res.status(422).send("There was an error with the format of your request. Title required.");

  if(!req.body.price) return res.status(422).send("There was an error with the format of your request. Price required.");

  Service.findOneAndUpdate({ service_id: service_id }, {"$set": {
    title: req.body.title,
    description: req.body.description,
    picture_url: req.body.picture_url,
    price: req.body.price,
  }}, { "new": true }).then((err, service) => {
    if(err) {
      return res.send(err)
    }
    res.status(200).send(service)
  })
});

app.delete("/delete-service/:service_id", cors(), async (req, res) => {
  const service_id = req.params.service_id;

  await Service.findOneAndDelete({ service_id: service_id }).then(service => {
    if(!service) {
      res.status(404).send("Could not delete that service because it does not exist.")
    }

    res.status(200).send(`Service ${service_id} successfully deleted.`)
  })
})
// SERVICES API CALLS END

// USER AUTHENTICATION START
app.post("/login", cors(), async (req, res) => {
  const { username, password } = req.body;

  const userWithUsername = await User.findOne({ username: username }).catch(err =>
    console.log(`Error: ${err}`)
  );

  if(!userWithUsername){
    console.log("username problem")
    return res.status(400).json({ message: "Username or password does not match." })
  }
  if(userWithUsername.password !== password) {
    console.log("password problem")
    return res.status(400).json({ message: "Username or password does not match." })
  }

  const jwtToken = jwt.sign(
    { id: userWithUsername.id, username: userWithUsername.username }, "apweihsdof32", { expiresIn: 36000 }
  )

  res.status(200).json({ message: "Welcome back!", token: jwtToken });

})
// USER AUTHENTICATION END

app.listen(process.env.PORT || port, () => {
  console.log(`Listening at https://radiant-light-server-b649d90c9bb7.herokuapp.com`)
})