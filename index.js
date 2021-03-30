const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5055;
const cors = require('cors')
require('dotenv').config();
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sqfgv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db("volunteer").collection("events");
    
    app.get('/events', (req, res) => {
        eventCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        eventCollection.insertOne(newEvent)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('/delete/:id', (req, res) => {
        eventCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.ok > 0)
        })
    })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)