import express, { json } from 'express';

import * as Sentry from '@sentry/node';
import cors from 'cors';
import 'express-async-errors';
import youch from 'youch';
import sentryConfig from './config/sentry';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(json());
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new youch(err, req).toJSON();
      return res.status(500).json(errors);
    });
  }
}

export default new App().server;
