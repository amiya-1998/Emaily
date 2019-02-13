const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport'); // passport.js uses the users model inside it. So we have to require it after the users model has been defined.

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // serve production assets like index.html, main.css file etc
  app.use(express.static('./client/build'));

  // If there is a inccoming route request that our express app doesn't understand then just forward it to index.html to see if it gets resolved there --> Kicks the user to the client side application
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve__(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT);
