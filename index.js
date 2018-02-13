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

passport.use(new FacebookStrategy({
  clientID: '137259860278534',
  clientSecret: '7ab6b947545c4e8ced1ff4f0562d87e9',    
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile)
  done(profile)
}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);
app.use(cors());

//API endpoints
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/login'}));


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