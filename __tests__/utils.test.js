require('dotenv').config(); 
const fakeRequest = require('supertest'); 
const app = require('../lib/app');

const { mungeLocationData, mungeWeatherData, mungeYelpData } = require('../lib/utils.js');
const { data } = require('../data/location-raw.js');
const { weather } = require('../data/weather-raw.js');
const { yelp } = require('../data/yelp-raw.js');

describe('utils', () => {
  // got rid of all the auth test stuff because we no longer have a database
  test('mungeLocationData', async() => {
    const expectation = {
      'latitude': '33.7489924',
      'longitude': '-84.3902644',
      'formatted_query': 'Atlanta, Fulton County, Georgia, USA'
    };
    const mungedData = mungeLocationData(data);
    expect(mungedData).toEqual(expectation);
  });

  test('returns weather', async() => {
    const expectation = [{
      forecast: 'Scattered clouds',
      time: '2021-10-08'
    }, {
      forecast: 'Broken clouds', 
      time: '2021-10-09'
    }]; 
  

    const mungedWeather = mungeWeatherData(weather); 

    expect(mungedWeather).toEqual(expectation);
  });

  test('returns review', async() => {
    const expectation = [{
      'image_url': expect.any(String),
      'name': expect.any(String),
      'price': '$$',
      'rating': expect.any(Number),
      'url': expect.any(String)
    }];

    const mungedYelp = mungeYelpData(yelp); 

    expect(mungedYelp).toEqual(expectation);
  });
});