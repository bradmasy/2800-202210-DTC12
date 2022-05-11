// homepage
// executed first when the serve is initiated
var currentUser;
const express  = require("express");
const app      = express();
const https    = require("https");
const session  = require("express-session");
const mongoose = require("mongoose");


app.use(session({secret:"shhhh", saveUninitialized:true, resave:true}));
app.set("view engine", "ejs");

app.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log(err);
});

const bodyparser = require("body-parser");
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

mongoose.connect(
  "mongodb+srv://fuel_line_2022:fuel@cluster0.vcuj9.mongodb.net/FuelLineDTC12?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//  mongoose.connect("mongodb://localhost:27017/Fuel_Line"); // our database on local host, not yet on server...

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  admin: Boolean,
});
const userModel = mongoose.model("users", userSchema);

/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/




// routes 

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/success", function (req, res) {
  console.log("success");
  res.render("success");
});

app.get("/profile", function(req,res){
  res.render("profile");
})

app.get("/admin_user_views", function(req,res){
  res.render("admin_user_views");
})

app.get("/logout", function(req,res){
  res.render("logout");
})

app.get("/map", function(req,res){
  res.render("map");
})

app.get("/statistics", function (req,res) {
  res.render("statistics");
})

function initiateSession(req,users)
//initiates a session
{
  if(checkUserExists(users)){
    req.session.authenticated = true; // user gets authenticated.
    req.session.user          = users; 

    console.log(`welcome ${users[0].username}`);
  }
  else
  {
    req.session.authenticated = false;
    console.log(`invalid user`);
  }
}

function checkUserExists(data) {
  if (data.length === 0) {
    console.log("User not found!");
    return false
  } else {
    currentUser = data;
    return true;
    //proceedToHome();
  }
}

app.post("/attemptLogin", function (req, res) {
  //checks if entered information matches an existing user in database
  console.log("req. has been received");
  console.log(req.body);
  userModel.find(
    {
      $and: [{ username: req.body.username }, { password: req.body.password }],
    },
    function (err, users) {
      if (err) {
        req.session.authenticated = false; // user gets authenticated.
      } else {
        initiateSession(req, users);    
      }
      res.send(users);
    }
  );
});

app.post("/displayUsersToAdmin", function (req, res) {
  //sends all users in database
  console.log("req. has been recieved");
  userModel.find({}, function (err, users) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + users);
    }
    res.send(users);
  });
});

app.post("/attemptSignup", function (req, res) {
  //adds user to users database
  console.log("req. has been received");
  console.log("attemptSignup called in server");
  userModel.insertMany({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    admin: req.body.admin
  }, function (err, users) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + users);
    }
    res.send(users);
  });
});


app.get("/logout", (req,res) => {
  // logs the user out of session
  console.log("req made");
  res.sendFile(__dirname + "/public/logout.html");

  if(req.session){
    delete req.session;
    console.log("logged out");
    // req.session.destroy((err) => {
    //  // res.status(400).send("Unable to log out")
    // });
  }
  else {
  
  }
})

app.get("/getUserInfo", function (req, res) {
  //sends the current session user info to the client
  if (req.session.user == 0) {
  res.render("index")
  }
  else {
    res.send(req.session.user)
  }
});



console.log("Server Running");
app.use(express.static("./public"));
