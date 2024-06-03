import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import logger from "./logger";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const PIPEDRIVE_API_URL = process.env.PIPEDRIVE_API_URL || 'https://api.pipedrive.com/v1/deals';
const API_TOKEN = process.env.API_TOKEN;

app.use(express.json());

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.Console()
//   ]
// });

app.get('/deals', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(PIPEDRIVE_API_URL, {
      params: { api_token: API_TOKEN }
    });
    logger.info('GET /deals');
    res.json(response.data);
  } catch (error: any) {
    logger.error('Error in GET /deals', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});


app.post('/deals', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(PIPEDRIVE_API_URL, req.body, {
      params: {api_token: API_TOKEN}
    });
    logger.info('POST /deals', {body: req.body});
    res.json(response.status)
  } catch(error: any) {
    logger.error('Error in POST /deals', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.put('/deals/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`${PIPEDRIVE_API_URL}/${id}`, req.body, {
      params: { api_token: API_TOKEN }
    });
    logger.info('PUT /deals', {body: req.body});
    res.json(response.data);
  } catch (error: any) {
    logger.error('Error in POST /deals', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});



app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
