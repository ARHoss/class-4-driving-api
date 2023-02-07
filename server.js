// Getting Express module
const express = require('express');
// Express app varibale
const app = express();
// Getting Mongo DB Client
const MongoClient = require('mongodb').MongoClient
// fixes cors error
const cors = require('cors');
// import .env file for securing database string
require('dotenv').config();
// Port
const PORT = 7000;


// applies cors module to project
app.use(cors());
// Enables express to read data from post
app.use(express.urlencoded({ extended: true }))
// Tells server to be able to read JSON for PUT request
app.use(express.json());

// db variables
let db, collectionName;
// Mongo Connetion String from .env file
const connectionString = process.env.DB_STRING;
// Connecting to MongoDB
MongoClient.connect(connectionString, { useUnifiedTopology: true})
    .then(client => {
        console.log('connected to database');
        // Datbase name
        db = client.db('Islamic-info')
        // Database collection name
        collectionName = db.collection('99-names-of-Allah')

        // Listener on port provided by the environment or 3000
        app.listen(process.env.PORT || PORT, function() {
            console.log('listening on: '+PORT)
        })
})
.catch(console.error);

// main page
app.get('/', (req, res) => {
    console.log('Successfully Loaded Main Page');
    res.sendFile(__dirname + '/index.html');
})

// API Code

// send all names
app.get('/api', (req,res) => {
    // Mongo read query
    db.collection('99-names-of-Allah').find().toArray()//insert all the objects to an array
       // Mongo returns a promise
       .then(data => {
           console.log('Successfully Received All Names');
           // Sedning all JSON object to the user
           res.json(data)
       })
       .catch(error => console.error(error))
})

// send requested name
app.get('/api/:order', (req,res) => {
   
   // Query parameter
   let data = {
       'order': Number(req.params.order)
   };

   if(data['order'] <= 99 && data['order'] >= 1){
       // Mongo read query
       db.collection('99-names-of-Allah').findOne(data)
           // Mongo returns a promise
           .then(data => {
               console.log('Successfully Received 1 Name');
               // Sedning JSON object to the user
               res.json(data)
           })
           .catch(error => console.error(error))
   }else{
       const error = {
           'error':'incorrect parameter',
           'resolve': 'example: 1st or 2nd, 3rd.....'
       }
       res.json(error);
   }

   
})


// create

// Variable to increment
// let order = 99;

// app.post('/addNames', (req, res) => {

    // Incrementing order variable by 1
    // order = order+1;

    // Receives data from postman
//     const data = {
//         order:      order,
//         name:       req.body.name,
//         meaning:    req.body.meaning
//     }
    // Mongo create a new document
//     collectionName.insertOne(data)
//         .then(result => {
//             console.log('Create Request Completed');
            // Refreshes the page
//             res.redirect('/api');
//         })
//         .catch(error => console.error(error))
    
// });    