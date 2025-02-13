import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from './router/authRoute.js';
import productRoute from './router/ProductsRoute.js';
import userRoute from './router/AppUsers.js';
import cartRoute from './router/CartRoute.js';
import orderRoute from './router/OrderRoute.js';
import bankRoute from './router/Banks.js'
import wishRoute from './router/WishRoute.js';
import rateLimiter from 'express-rate-limit';
import xss from 'xss-clean';
import { swaggerUi, swaggerDocs } from "./swaggerConfig.js";

import RewviewsandRatingRoute from './router/rewiewandRating.js';


dotenv.config()

const app = express();
const port = process.env.PORT || 4000;
// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
const corsOptions = {
    origin:true,
    credentials:true
}



// security packages
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['POST', 'GET', 'PATCH', 'DELETE']
}))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.set('trust proxy', 1)
const Limiter = rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

// app.use(Limiter())

app.use(helmet());
app.use(xss());

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
app.use(cors(corsOptions))
app.use(cookieParser())
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/carts', cartRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/wishes', wishRoute);
app.use('/api/v1/banks', bankRoute);
app.use('/api/v1/reviews', RewviewsandRatingRoute);



app.listen(port, ()=>{
    connect()
    console.log('server is listening on port ', port)
})