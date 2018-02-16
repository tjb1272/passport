const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const db = new sqlite3.Database("./Chinook_Sqlite_AutoIncrementPKs.sqlite");
const Sequelize = require('sequelize');
const router = express.Router();
const cors = require("cors");


const routes = require('./routes/index');
const users = require('./routes/users');


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);
app.use(cors());


//API endpoints
// app.get('/auth/facebook', passport.authenticate('facebook'));
// app.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/login'}));


//Header
var http = require('http');
var options = { method: 'HEAD', port: 3000, path: '/' };
var req = http.request(options, function(res) {
  console.log(res.headers);
});
req.end();


//Connection
const sequelize = new Sequelize('Music', 'tjb1272', null, {
  host: 'localhost',
  dialect: 'sqlite',
  storage: './Chinook_Sqlite_AutoIncrementPKs.sqlite'
});


//Models
const Users = sequelize.define(
  'users',
  {
    UserId: {
      type: Sequelize.STRING,
      autoIncrement: false,
      primaryKey: true
    },
    AuthId: {
      type: Sequelize.STRING,
      autoIncrement: true,
      primaryKey: true
    },
      Name: Sequelize.STRING,
      Email: Sequelize.STRING,
      Role: Sequelize.STRING,
    },
  {
    freezeTableName: true,
    timestamps: false
  }
);

const Artist = sequelize.define(
  "Artist",
  {
    ArtistId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Name: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);


const Album = sequelize.define(
  "Album",
  {
    AlbumId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Title: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

passport.serializeUser((user, done) => {
  done(null, user._id)
});

passport.deserializeUser((id, done) => {
  User.findAll({ where: {
      userId: id
  }}, (err, user) => {
      if(err || !user ) return done(err, null);
      done(null, user);
  });
});

function d (app, option) {
  // if success and failure redirects aren't specific, set some reasonable defaults
  if(!options.successRedirect)
      options.successRedirect = '/register';
  if(!options.failureRedirect)
      options.failureRedirect = '/login';

  return {
      init: function() { 
          var env = app.get('env');
          var config = options.providers
         },
      registerRoutes: function() { 
          // register Facebook routes
          app.get('/auth/facebook', function(req, res, next) {
            passport.authenticate('facebook', {
              callbackURL:
              'http://localhost:3000/auth/facebook/callback' +
                encodeURIComponent(req.query.redirect)
            })(req, res, next);
          });
        }
  }
};


// init: function a () {
//   var env = app.get('env');
//   var config = options.providers;


  //configure Facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: '137259860278534',
        clientSecret: '7ab6b947545c4e8ced1ff4f0562d87e9',    
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        const authId = 'facebook:' + profile.id;
        User.findOne({ where: { authId: authId } }, function(err, user) {
          if (err) return done(err, null);
          if (user) return done(null, user);
          User.create({
            authId: authId,
            name: profile.displayName,
            role: 'user'
          });
        });
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());


// registerRoutes: function r () {
//   // register Facebook routes
//   app.get('/auth/facebook', function(req, res, next) {
//     passport.authenticate('facebook', {
//       callbackURL:
//       'http://localhost:3000/auth/facebook/callback' +
//         encodeURIComponent(req.query.redirect)
//     })(req, res, next);
//   });


  app.get(
    '/auth/facebook/callback',
    passport.authenticate(
      'facebook',
      { failureRedirect: options.failureRedirect },
      function(req, res) {
        // we only get here on successful authentication
        res.redirect(303, req.query.redirect || options.successRedirect);
      }
    )
  );



Artist.hasMany(Album, { foreignKey: "ArtistId" });
Album.belongsTo(Artist, { foreignKey: "ArtistId" });


app.get('/album', (request, response) => {
  response.header({
    DBnumber: 01,
    Music: true
  });
  if (request.header('music-request') === 'album-artist') {
    Album.findAll({
      include: [
        {
          model: Artist
        }
      ]
    }).then(albumArtist => {
      response.json(albumArtist);
    });
  } else if (request.header('music-request') === 'album') {
    Album.findAll().then(albums => {
      response.json(albums);
    });
  }
});
                

app.use((req, res) => {
  res.status(400);
  res.render('404');
});


app.listen(3000, () => {
  console.log('server running')
});

module.exports = router;
  dialect: 'sqlite',
  storage: './Chinook_Sqlite_AutoIncrementPKs.sqlite'
});


//Models
const Users = sequelize.define(
  'Users',
  {
    UserId: {
      type: Sequelize.STRING,
      autoIncrement: false,
      primaryKey: true
    },
    AuthId: {
      type: Sequelize.STRING,
      autoIncrement: true,
      primaryKey: true
    },
      Name: Sequelize.STRING,
      Email: Sequelize.STRING,
      Role: Sequelize.STRING,
    },
  {
    freezeTableName: true,
    timestamps: false
  }
);

const Artist = sequelize.define(
  "Artist",
  {
    ArtistId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Name: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);


const Album = sequelize.define(
  "Album",
  {
    AlbumId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Title: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);


Artist.hasMany(Album, { foreignKey: "ArtistId" });
Album.belongsTo(Artist, { foreignKey: "ArtistId" });


app.get('/album', (request, response) => {
  response.header({
    DBnumber: 01,
    Music: true
  });
  if (request.header('music-request') === 'album-artist') {
    Album.findAll({
      include: [
        {
          model: Artist
        }
      ]
    }).then(albumArtist => {
      response.json(albumArtist);
    });
  } else if (request.header('music-request') === 'album') {
    Album.findAll().then(albums => {
      response.json(albums);
    });
  }
});
                                                                                                                                                           
app.use((req, res) => {
  res.status(400);
  res.render('404');
});


app.listen(3000, () => {
  console.log('server running')
});
