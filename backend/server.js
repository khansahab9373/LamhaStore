import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorMiddleware.js";
import connectDB from "./connection/db.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import cors from "cors";

// ENABLE CORS FOR ALL ROUTES


dotenv.config();
connectDB();

const app = express();
app.use(cors({origin: "*"}));

const port = process.env.PORT || 8080;

// MIDDLEWARE TO PARSE JSON REQUESTS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ROUTES
app.use('/api/users',userRouter)
app.use("/api/products", productRouter);
app.use('/api/orders',orderRouter)

app.get("/", (req, res) => {
  res.send("App is running...");
});


// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
