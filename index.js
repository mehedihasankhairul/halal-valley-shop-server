const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')

require('dotenv').config()


const port = process.env.PORT || 5055


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1eg3a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("halalValley").collection("products");


  app.get("/product", (req, res) => {
    productCollection.find()
      .toArray((err, product) => {
        res.send(product)
        console.log('from database', product)

      })
  })

  app.get("/checkout/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection.findOne({_id:id})
    .then((product) => {
      res.send(product)
      console.log('from database', product)
    })
  
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new Product:', newProduct)

    productCollection.insertOne(newProduct)
      .then(result => {
        console.log('Products', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('deleteProduct/:id' , (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    productCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
    
   })

  // // app.delete('/deleteProduct/:id', (req, res) => {
  // productCollection.findOneAndDelete({_id: ObjectID(req.params.id)})
  // .then( result => {
  //   console.log(result)
  // })

  //   const id = ObjectID(req.params.id);
  //   productCollection.findOneAndDelete({_id:id})
  //   .then(document => res.send(!!document.value))
  // })

  // client.close();

});

app.get('/', (req, res) => {
  res.send('here is server site!')
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})