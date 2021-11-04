const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const cors = require('cors');

const config = require('./config/config');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient({
  host: config.REDIS_URL,
  port: config.REDIS_PORT
});


const app = express();

const connectWithRetry = () => {
  // @mongo里之所以mongo可以获取到mongodb所在服务的ip是由于docker的dns已经自动为mongo这个服务设置了ip的映射
  mongoose.connect(`mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`).then(() => {
    console.log('Successfully connected to mongo')
  }).catch((err) => {
    console.log(err);
    setTimeout(connectWithRetry, 5000);
  })
}

connectWithRetry();

const PORT = process.env.PORT || 3000;

app.use(cors({}));
app.use(session({
  store: new RedisStore({
    client: redisClient,
  }),
  secret: config.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60000
  }
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Hello Docker Node!!!`);
});

app.get('/api/v1', (req, res) => {
  console.log('yeah it runs');
  res.send(`<h2>${'Hello There'}</h2>`)
})

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`)
}); 