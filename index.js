import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';
import xss from 'xss-clean';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

// Import Routes
import authRoute from './router/authRoute.js';
import productRoute from './router/ProductsRoute.js';
import userRoute from './router/AppUsers.js';
import cartRoute from './router/CartRoute.js';
import orderRoute from './router/OrderRoute.js';
import bankRoute from './router/Banks.js';
import wishRoute from './router/WishRoute.js';
import contactRoute from './router/Contact.js'
import RewviewsandRatingRoute from './router/rewiewandRating.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Load Swagger YAML
const swaggerDocument = YAML.load('./swagger.yaml');

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log("Swagger documentation available at /api-docs");

const corsOptions = {
    origin: ["http://localhost:3000", "https://farm-swift.vercel.app/"],
    credentials: true,
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'PUT']
};

// Security packages
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // Only if needed
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Change * to a specific domain if needed
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
  
app.set('trust proxy', 1);
const Limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

app.use(helmet());
app.use(xss());

// ✅ Fix: Increase the payload size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/carts', cartRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/wishes', wishRoute);
app.use('/api/v1/banks', bankRoute);
app.use('/api/v1/contact', contactRoute);
app.use('/api/v1/reviews', RewviewsandRatingRoute);

// MongoDB Connection
mongoose.set("strictQuery", false);
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB database connected');
    } catch (err) {
        console.log('MongoDB database connection failed');
    }
};

app.listen(port, () => {
    connect();
    console.log('Server is listening on port', port);
});
