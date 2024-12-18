import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import server from "./routes/server.js";
import employeeRoute from "./routes/employee.route.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";


const app = express();

dotenv.config({path: './.env'});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5174',  // Your frontend URL (adjust port if necessary)
    credentials: true,  // Allow credentials like cookies to be sent
}));

const port = process.env.PORT || 8081;


app.listen(port,"0.0.0.0", () => {
    console.log("Server running on port: " + port);
})

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/employee/", employeeRoute);
app.use(server);

import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import departmentRoute from "./routes/department.route.js";
import employeeRoute from "./routes/employee.route.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import designationRoute from "./routes/designation.route.js";

const app = express();

dotenv.config({path: './.env'});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL (adjust port if necessary)
    credentials: true,  // Allow credentials like cookies to be sent
}));

const port = process.env.PORT || 3000;


app.listen(port,"0.0.0.0", () => {
    console.log("Server running on port: " + port);
})

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/department/", departmentRoute);
app.use("/api/v1/employee/", employeeRoute);
app.use("/api/v1/designation/", designationRoute);