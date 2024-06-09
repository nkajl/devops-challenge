import request from 'supertest';
import { metricsServer } from '../metrics';

describe('GET /metrics', () => {
    it('should return status code 200 and metrics', async () => {
      const response = await request(metricsServer).get('/metrics');
      expect(response.status).toBe(200);
      expect(response.text).toBeDefined();
    });
  });
  
