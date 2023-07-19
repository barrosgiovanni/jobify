// basic imports
require('express-async-errors');
require('dotenv').config()
const morgan = require('morgan');
const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// db and authenticateUser
const connectDB = require('./db/connect');

// router
const authRouter = require('./routes/authRoutes');
const jobsRouter = require('./routes/jobsRoutes');

//middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/auth');

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests. Please, try again in 15 minutes.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// routes
app.get('/', (req, res) => {
  res.send('Welcome to Jobify!');
});

app.get('/api/v1', (req, res) => {
  res.send('Welcome to API!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build/', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// defining port
const port = process.env.PORT || 5000

// running server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is running on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
