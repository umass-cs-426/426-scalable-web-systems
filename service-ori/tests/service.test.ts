import request from 'supertest';
import { getApp } from '../src/index';  // Import the Express application

describe("GET /users", () => {
  it("should return all users", async () => {
    const response = await request(getApp()).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' }
    ]);
  });
});

describe("GET /users/:id", () => {
  it("should return a single user", async () => {
    const response = await request(getApp()).get('/users/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
  });

  it("should return 404 for a non-existent user", async () => {
    const response = await request(app).get('/users/999');
    expect(response.statusCode).toBe(404);
  });
});