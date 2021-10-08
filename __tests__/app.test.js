require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');


describe('app routes', () => {
  describe('routes', () => {

    test('returns location', async() => {
      const expectation = {
        'formatted_query': expect.any(String),
        'latitude': expect.any(String),
        'longitude': expect.any(String)
      };

      const data = await fakeRequest(app)
        .get('/location')
        .expect('Content-Type', /json/);
        //.expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});