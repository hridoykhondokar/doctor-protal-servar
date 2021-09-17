const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mvf4b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()



app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db(`${process.env.DB_NAME}`).collection("appointment");
  console.log('db ok')
  
  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

    app.post('/appointmentByDate', (req, res) => {
      const time = req.body;
      console.log(time.date);
      appointmentCollection.find({date: time.date})
      .toArray(documents => {
        res.send(documents);
      })
    })



});




app.get('/', (req, res) => {
  res.send('Hello World how are you!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})