const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const request = require('superagent');
const { mungeLocationData, mungeWeatherData, mungeYelpData } = require('./utils.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/location', async(req, res) => {
  try {
    const cityName = req.query.search; 
    const response = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_KEY}&q=${cityName}&format=json`);

    const mungedResponse = mungeLocationData(response.body); 
    
    res.json(mungedResponse);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/weather', async(req, res)=>{
  try{
    const { latitude, longitude } = req.query;
    const response = await request.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHER_KEY}`);
    
    const mungedResponseTwo = mungeWeatherData(response.data); 

    res.json(mungedResponseTwo);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;

app.get('/reviews', async(req, res)=>{
  try{
    const longitude = req.query.longitude; 
    const latitude = req.query.latitude; 
    const yelpData = await request
      .get(`https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}`)
      .set('Authorization', `Bearer ${process.env.YELP_KEY}`);

    const mungedYelpData = mungeYelpData(yelpData.body.businesses);
    res.json(mungedYelpData);  
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});