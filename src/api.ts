import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import moment from 'moment';

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

async function dirExists(dirPath: string)
{
    try
    {
        const res = await fs.stat(dirPath)
        return res.isDirectory()
    }
    catch (err)
    {
        return false;
    }
}

// telebirr notify endpoint
app.post('/telebirr-notify', async (req, res) => {
  const dateTime = moment().format('YYYY-MM-DDTHH:mm:ss');
  const logsDirExists = await dirExists('./logs')
  if(!logsDirExists) await fs.mkdir('./logs');
  await fs.writeFile(
    `./logs/callback-data-logs${dateTime}.json`,
    JSON.stringify(req.body, null, 2)
  );
  res.status(200).send({ status: 'ok', callback_data: req.body });
});

const api = express.Router();

api.get('/hello', (req, res) => {
  res.status(200).send({ message: 'hello world' });
});

// Version the api
app.use('/api/v1', api);
