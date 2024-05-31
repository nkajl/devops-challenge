import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const PIPEDRIVE_API_URL = process.env.PIPEDRIVE_API_URL || 'https://api.pipedrive.com/v1/deals';
const API_TOKEN = process.env.API_TOKEN;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Init TypeScript application");
});

app.get('/deals', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(PIPEDRIVE_API_URL, {
      params: { api_token: API_TOKEN }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
