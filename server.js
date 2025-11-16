require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./src/routes/auth');

const app = express();
/*

*/
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// CORS for cookies
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, // e.g. http://localhost:3000
    credentials: true,
}));

//test new db connection.
// Connect DB
mongoose.connect(process.env.MONGODB_URL) .then(() => console.log('Database connected')) .catch((err) => { console.error('DB connection error:', err); process.exit(1); });

// Routes
app.use('/api/auth', authRoutes);

// Central error handler
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({error: err.message || 'Server error'});
});

if (process.env.NODE_ENV !== "test") {
  app.listen(8000, () => console.log(`Server running on :${8000}`));
}

module.exports = app;


