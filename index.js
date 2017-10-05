const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require('body-parser');
const keys = require("./config/keys.js");

require("./models/user.js");
require("./models/Survey.js");
require("./services/passport.js");

mongoose.connect(keys.mongoURI);

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

require("./routes/authRoutes.js")(app);
require("./routes/billingRoutes.js")(app);
require("./routes/surveyRoutes.js")(app);

if(process.env.NODE_ENV === 'production'){
  // Express will serve up prod assets like main.js and css
  app.use(express.static('client/build'));

  //Express will serve up the index.html file if it doesnt recognize routes
  const path = require('path');

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
