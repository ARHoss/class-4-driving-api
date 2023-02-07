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
        db = client.db('class-4-driving-api')
        // Database collection name
        collectionName = db.collection('questions')

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

// send all questions
app.get('/api', (req,res) => {
    // Mongo read query
    collectionName.find().toArray()//insert all the objects to an array
       // Mongo returns a promise
       .then(data => {
           console.log('Successfully Received All Questions');
           // Sedning all JSON object to the user
           res.json(data)
       })
       .catch(error => console.error(error))
})

// send requested question number
app.get('/api/:questionNumber', (req,res) => {
   
   // Query parameter
   let data = {
       'questionNumber': Number(req.params.questionNumber)
   };
   console.log(data)


    // Mongo read query
    collectionName.findOne(data)
        // Mongo returns a promise
        .then(data => {
            console.log('Successfully Received 1 Question');
            // Sedning JSON object to the user
            
            if(data){
                res.json(data)

            }else{
                res.json('No question available on the number');
            }
            
        })
        .catch(error => console.error(error)) 
})

// create post using postman
let num = 1;
app.post('/api/addQuestion', (req, res) => {

    num++;
    // Receives data from postman
    const data = {
        questionNumber:      num,
        question:       req.body.question,
        answer:    req.body.answer
    }
    // Mongo create a new document
    collectionName.insertOne(data)
        .then(result => {
            console.log('Create Request Completed');
            // Refreshes the page
            res.redirect('/api');
        })
        .catch(error => console.error(error))
    
});    