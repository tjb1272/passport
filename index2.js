//module imports
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require ('express-session');
const app = express();
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const db = new sqlite3.Database("./Chinook_Sqlite_AutoIncrementPKs.sqlite");
const Sequelize = require('sequelize');
const cors = require('cors');