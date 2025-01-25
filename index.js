import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './router/authRoute.js';
import userRoute from './router/AppUsers.js';
import RewviewsandRatingRoute from './router/rewiewandRating.js';


dotenv.config()

const app = express();
const port = process.env.PORT || 4000;


mongoose.set("strictQuery", false)
const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('MongoDB database connected')
    } catch (err) {
        console.log('MongoBD database connection failed');
    }
}

app.use(express.json())
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', RewviewsandRatingRoute);



app.listen(port, ()=>{
    connect()
    console.log('server is listening on port ', port)
})