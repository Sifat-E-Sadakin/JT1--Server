const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
require('dotenv').config()
app.use(express.json())
app.use(cors())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_U}:${process.env.DB_P}@cluster0.rohhp7w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    let usersCollection = client.db('JT_1').collection('users')
    // Connect the client to the server	(optional starting in v4.7)

    app.get('/users', async(req, res)=>{
        let users = await usersCollection.find().toArray();
        let result = users;
        res.send(result);
    })

    app.get('/users/:id', async(req, res)=>{
      let id = req.params.id
      let find ={ _id : new ObjectId(id)}

      let result =await usersCollection.findOne(find);
      res.send(result);
  })

    app.post('/addUser', async (req, res)=>{
      let data = req.body;
      let result = await usersCollection.insertOne(data);
      res.send(result)
    })

    app.put('/updateUser/:id', async (req, res)=>{
      let data = req.body;
      let id = req.params.id

      let filter = { _id: new ObjectId(id) };
   
      let options = { upsert: true };
    
    let updateDoc = {
      $set: {
        name : data.name,
        email : data.email,
        phone : data.phone
      },
    };
      let result = await usersCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    app.delete('/remove/:id', async(req, res)=>{
      let id = req.params.id

      let find = { _id: new ObjectId(id) };

      let result = await usersCollection.deleteOne(find);
   
      res.send(result);
  })


    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})