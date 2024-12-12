import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import { launchBot } from './bot/bot';
import { LoggerService } from './services/loggerService';

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  LoggerService.log(`Server is running on port ${PORT}`, 'info');
});
app.use("/", routes);

launchBot();

