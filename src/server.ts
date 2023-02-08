import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middlewares/logger';

import ChainController from './controllers/chainController';

const port = 3000;

const app = new App({
    port,
    controllers: [
        new ChainController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware
    ]
});

app.listen();