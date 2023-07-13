import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './Routes/userRoutes.js';
import { seedRouter } from './Routes/seedRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express()

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/users" , userRouter)
app.use("/api/seed/resetData" , seedRouter)

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(PORT);
    console.log(`Server running on port ${PORT}`);
}).catch(err => console.log(err));
