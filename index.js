const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middle-were
app.use(cors())
app.use(express.json())

// mongodb info
// pass: a5jsDMhKLp7JXMn1
// 2y6mDZdZgVEwGw6q



const uri = "mongodb+srv://hasankha1023:2y6mDZdZgVEwGw6q@cluster0.mfxfsmq.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // set userCollection
    const userCollection =  client.db("mongoDB").collection("users");
    
    // create new users
    app.post('/users', async(req, res) => {
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser)
        res.send(result)
    })

    // read all users
    app.get('/users', async(req, res)=> {
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    // get specific user
    app.get('/users/:id', async(req, res)=> {
      const userId = req.params.id;
      const query = {_id: new ObjectId(userId)}
      const result = await userCollection.findOne(query)
      res.send(result)
    })

    // delete specific user
    app.delete('/users/:id', async(req, res)=> {
      const deletedId = req.params.id;
      const query = {_id: new ObjectId(deletedId)}
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })

    // update profile
    app.put('/users/:id', async(req, res)=> {
      const id = req.params.id;
      const user = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true}
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }
      const result = await userCollection.updateOne(filter, updateUser, options)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);




app.get('/', (req, res)=> {
    res.send('This is mongodb practice project server')

})

app.listen(port, ()=> {
    console.log(`The serer is running on: ${port}`)
})