require('dotenv').config();
const connectDB = require('./db/connect');
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

const port = process.env.PORT || 3000;

function setCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}

app.use(cors(
    {
        origin: ['https://food-delivery-frontend-self.vercel.app'],
        methods: ["POST", "GET", "PATCH", "DELETE"],
        credentials: true
    }
));
app.use(setCorsHeaders);
app.use(express.json({limit: '50mb'}));
// app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use('/api/auth', userRoutes);
app.use('/api/restaurant', restaurantRoutes);

const start = async () => {
    try
    {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening on ${port}`));
    }
    catch(error)
    {
        console.log(error);
    }
};
start();
