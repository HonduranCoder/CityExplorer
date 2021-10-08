const { urlencoded } = require('express');

function mungeLocationData(body) {
  return {
    latitude: body[0].lat,
    longitude: body[0].lon,
    formatted_query: body[0].display_name,
  };
}
  

function mungeWeatherData(body){
  const shapeData = body.map(item => {
    return{
      forecast:item.weather.description,
      time:item.valid_date
    };
  });
  return shapeData;
}


function mungeYelpData(reviews){
  const response = reviews.map(review => {
    return{
      name: review.name,
      image_url: review.image_url,
      price: review.price, 
      rating: review.rating,
      url: review.url
    };
  });
  return response;
}

module.exports = {
  mungeLocationData,
  mungeWeatherData, 
  mungeYelpData
};