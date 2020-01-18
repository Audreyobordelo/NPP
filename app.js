require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

const Media = require('./models/media.js');

mongoose
  .connect('mongodb://localhost/npp', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// express session
app.use(session({
  secret: "our-passport-local-strategy-app",
  // ne pas oublier le store pour que la connexion se réinitialise pas
  store: new MongoStore( { mongooseConnection: mongoose.connection }),
  resave: true,
  saveUninitialized: true
}));

passport.serializeUser((media, cb) => {
  cb(null, media._id);
});

passport.deserializeUser((id, cb) => {
  Media.findById(id, (err, media) => {
    if (err) { return cb(err); }
    cb(null, media);
  });
});

app.use(flash());
passport.use(new LocalStrategy({
  passReqToCallback: true,
  // pour dire à passport qu'on utilise par le nom "username"
  usernameField: 'email'
}, (req, email, password, next) => {
  Media.findOne({ email }, (err, media) => {
    if (err) {
      return next(err);
    }
    if (!media) {
      return next(null, false, { message: "Incorrect email" });
    }
    if (!bcrypt.compareSync(password, media.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, media);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

const authRouter = require('./routes/media/auth.js');
app.use('/', authRouter);

const profileRouter = require('./routes/media/profile.js');
app.use('/', profileRouter);

const allRouter = require('./routes/articles/all.js');
app.use('/article', allRouter);

const editRouter = require('./routes/articles/edit.js');
app.use('/article', editRouter);

const newRouter = require('./routes/articles/new.js');
app.use('/article', newRouter);





module.exports = app;
