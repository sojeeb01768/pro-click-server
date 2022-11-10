const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kvqywrf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('sportsPhotography').collection('services');
        const reviewCollection = client.db('sportsPhotography').collection('reviews');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        app.get('/all', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);

            // service api 

            app.post('/all', async (req, res) => {
                const service = req.body;
                const result = await serviceCollection.insertOne(service);
                res.send(result)
            });

            // review api
            app.get('/reviews', async (req, res) => {

                let query = {};
                if (req.query.email) {
                    query = {
                        email: req.query.email
                    }
                }
                const cursor = reviewCollection.find(query);
                const reviews = await cursor.toArray();
                res.send(reviews);
            });


            app.get('/reviews', async (req, res) => {
                let query = {};
                if (req.query.service) {
                    query = {
                        service: req.query.service
                    }
                }
                const cursor = reviewCollection.find(query).sort({ "_id": -1 })
                const reviews = await cursor.toArray();
                res.send(reviews)
            });

            app.post('/reviews', async (req, res) => {
                const review = req.body;
                const result = await reviewCollection.insertOne(review)
                res.send(result);
            });

            app.get('/reviews/:id', async (req, res) => {
                const id = req.params.id;
                const query = {
                    _id: ObjectId(id)
                };
                const review = await reviewCollection.findOne(query);
                res.send(review)
            });

            app.delete('reviews/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = await reviewCollection.deleteOne(query);
                res.send(result);
            })
        })

    }
    finally {

    }
}

run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('sports photography running')
})

app.listen(port, () => {
    console.log(`sports photography running on ${port}`);
})