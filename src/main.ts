import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

const parseCorsWhitelist = (list: string): string[] => {
  return list != null ? list.split(';') : ['http://localhost:3000'];
};

const applicationPort = process.env.APP_PORT || 5000;
const corsWhiteList = parseCorsWhitelist(process.env.APP_CORS_WHITELIST);

const applyMiddlewares = (app: INestApplication) => {
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
};

const enableCors = (app: INestApplication) => {
  app.enableCors({
    origin: function (origin, callback) {
      if (
        corsWhiteList.indexOf(origin) !== -1 ||
        typeof origin === 'undefined'
      ) {
        callback(null, true);
      } else {
        Logger.log('blocked cors for: ' + origin, '[CORS]');
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });
};

(async () => {
  const app = await NestFactory.create(AppModule);
  enableCors(app);
  applyMiddlewares(app);
  await app.listen(applicationPort);
})();
