require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const cookieParser = require("cookie-parser");
const homeRoutes = require('./routes/MainRoute');
const authRoutes = require('./routes/AuthRoute');
const adminRoutes = require('./routes/AdminRoute');
const barberRoutes = require('./routes/BarberRoute');
const { MONGO_URL, PORT } = process.env;

mongoose
  .connect('mongodb+srv://pollodrax:<nastia>@cluster0.htpcyzl.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: 'pollodrax',
    pass: 'nastia',
  })
  .then(() => {
    console.log("MongoDB is connected successfully");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1); // Завершити процес, якщо не вдалося підключитися до бази даних
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(cors());  

app.use(cookieParser());

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use("/", homeRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes); 
app.use("/barb", barberRoutes); 