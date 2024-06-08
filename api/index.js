import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import authRoute from "./routers/auth-route.js";
import userRoute from "./routers/user-route.js";
import postRoute from "./routers/post-route.js";
import commentRoute from "./routers/comment-route.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import cookieParser from "cookie-parser";


const app=express();

const corsOptions={
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    credentials:true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRoute);
app.use('/api/user',userRoute);
app.use('/api/post',postRoute);
app.use('/api/comment',commentRoute);


app.use(errorMiddleware);

const PORT=3000;

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running at http://localhost:${PORT}`);
    });
});

