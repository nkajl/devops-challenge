import request from 'supertest';
import { app, server } from '../index';
import { metricsServer } from '../metrics';
import axios from 'axios';

describe("GET /deals endpoint", () => {
  it("should return success", async () => {
    await request(app)
      .get("/deals")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("should handle server errors", async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({ response: { status: 500 } });

    await request(app)
      .get("/deals")
      .expect(500);
  });

  it("should handle errors from external API", async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('API Error'));

    await request(app)
      .get("/deals")
      .expect(500);
  });
});

describe("POST /deals endpoint", () => {
  it("should return success", async () => {
    const testData = {
      title: "Test Deal",
      value: 1000,
      currency: "USD",
    };

    await request(app)
      .post("/deals")
      .send(testData)
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("should handle validation errors", async () => {
    await request(app)
      .post("/deals")
      .send({})
      .expect(500);
  });

  it("should handle server errors from external API", async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce({ response: { status: 500 } });

    const testData = {
      title: "Test Deal",
      value: 1000,
      currency: "USD",
    };

    await request(app)
      .post("/deals")
      .send(testData)
      .expect(500);
  });

  it("should handle timeout errors from external API", async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce({ code: 'ECONNABORTED' });

    const testData = {
      title: "Test Deal",
      value: 1000,
      currency: "USD",
    };

    await request(app)
      .post("/deals")
      .send(testData)
      .expect(500);
  });

  it("should handle other errors from external API", async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Unknown error'));

    const testData = {
      title: "Test Deal",
      value: 1000,
      currency: "USD",
    };

    await request(app)
      .post("/deals")
      .send(testData)
      .expect(500);
  });
});

describe("PUT /deals endpoint", () => {
  it("should return success", async () => {
    const testData = {
      id: 1,
      title: "Update Test Deal",
      value: 10011,
      currency: "USD",
    };

    await request(app)
      .put("/deals/1")
      .send(testData)
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("should handle errors from external API", async () => {
    jest.spyOn(axios, 'put').mockRejectedValueOnce(new Error('API Error'));

    await request(app)
      .put("/deals/1")
      .send({})
      .expect(500);
  });

  it("should handle validation errors", async () => {
    await request(app)
      .put("/deals/1")
      .send({})
      .expect(500);
  });

  it("should handle server errors from external API", async () => {
    jest.spyOn(axios, 'put').mockRejectedValueOnce({ response: { status: 500 } });

    const testData = {
      id: 1,
      title: "Update Test Deal",
      value: 10011,
      currency: "USD",
    };

    await request(app)
      .put("/deals/1")
      .send(testData)
      .expect(500);
  });

  it("should handle timeout errors from external API", async () => {
    jest.spyOn(axios, 'put').mockRejectedValueOnce({ code: 'ECONNABORTED' });

    const testData = {
      id: 1,
      title: "Update Test Deal",
      value: 10011,
      currency: "USD",
    };

    await request(app)
      .put("/deals/1")
      .send(testData)
      .expect(500);
  });

  it("should handle other errors from external API", async () => {
    jest.spyOn(axios, 'put').mockRejectedValueOnce(new Error('Unknown error'));

    const testData = {
      id: 1,
      title: "Update Test Deal",
      value: 10011,
      currency: "USD",
    };

    await request(app)
      .put("/deals/1")
      .send(testData)
      .expect(500);
  });
});

afterAll(done => {
  server.close(() => {
    metricsServer.close();
    done();
  });
});
