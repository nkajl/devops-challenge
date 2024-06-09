import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import logger from "./logger";
import { metricsServer, updateMetrics } from './metrics';

dotenv.config();

export const app: Express = express();
const PORT = process.env.PORT || 3000;
const METRICS_PORT = process.env.METRICS_PORT || 8080;
const PIPEDRIVE_API_URL = process.env.PIPEDRIVE_API_URL || 'https://api.pipedrive.com/v1/deals';
const API_TOKEN = process.env.API_TOKEN;

app.use(express.json());

app.use(updateMetrics);

app.get('/deals', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(PIPEDRIVE_API_URL, {
      params: { api_token: API_TOKEN }
    });
    logger.info('GET /deals');
    res.json(response.data);
  } catch (error) {
    if(axios.isAxiosError(error)){
      logger.error('Error in GET /deals', { error: error.response?.data });  
    } else {
      logger.error('Error in GET /deals', { error: error });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});


app.post('/deals', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(PIPEDRIVE_API_URL, req.body, {
      params: {api_token: API_TOKEN}
    });
    logger.info('POST /deals', {body: req.body});
    res.json(response.data);
  } catch (error) {
    if(axios.isAxiosError(error)){
      logger.error('Error in POST /deals', { error: error.response?.data });  
    } else {
      logger.error('Error in POST /deals', { error: error });
    }
    res.status(500).json({ error: (error as Error).message });
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
  } catch (error) {
    if(axios.isAxiosError(error)){
      logger.error('Error in PUT /deals', { error: error.response?.data });  
    } else {
      logger.error('Error in PUT /deals', { error: error });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

export const server = app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

metricsServer.listen(METRICS_PORT, () => {
  logger.info(`Prometheus Metrics server listening on http://localhost:${METRICS_PORT}`);
});


module.exports = { app, server };
