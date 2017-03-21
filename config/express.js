import express from 'express';
import logger from 'morgan';
import compression from 'compression';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import favicon from 'serve-favicon';
import methodOverride from 'method-override';
import helmet from 'helmet';
import httpStatus from 'http-status';
import partials from 'express-partials';
import expressWinston from 'express-winston';
import winstonInstance from './winston';
import routes from '../src/controllers'
import config from './env';

const app = express();
if (config.env === 'development') {
  app.use(logger('dev'));
}

// 静态文件目录
var staticDir = config.rootPath + '/src/static/';
// 视图文件目录
var viewsDir = config.rootPath + '/src/views/';
// favicon
var faviconPath = staticDir + 'images/favicon.ico';
app.set('views', viewsDir);
app.use(favicon(faviconPath));
// 更改模板引擎
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

/**
 * midware
 */

app.use(express.static(staticDir));
app.use(partials());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
let corsOptions={};
if (config.env === 'production') {
  corsOptions = {
    origin: function (origin, callback) {
      const whitelist = config.whitelist;
      const originIsWhitelisted = whitelist.indexOf(origin) !== -1
      callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted)
    },
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
}
app.use(cors(corsOptions));
app.disable('x-powered-by');

app.use('/', routes);

app.use((err, req, res, next) =>
  res.render('common/error', { 
      error: err,
      title: 'error page' 
  })
);

export default app;
