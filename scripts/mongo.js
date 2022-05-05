const express    = require("express");
const app        = express();
const mongoose   = require("mongoose");
const bodyParser = require("body-parser");
let schema       = mongoose.schema;
let User         = require("./userModel");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/Fuel_Line");

let db = mongoose.connection;

db.once("open",function(){
    console.log("connection successful");
})


let user = new User({username:"ken",password:"password"});

user.save(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("user is saved");
    }
})




