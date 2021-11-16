const express = require("express");
const router = express.Router();
const car = require("../models/car");
const passengers = require("../models/passenger");
const { Client } = require("@googlemaps/google-maps-services-js");

//import * as geometry from 'spherical-geometry-js';
//const geometry = require("spherical-geometry-js")
//const fetch = require("node-fetch");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const client = new Client({});

router.get("/", (req, res) => {
  res.json("OK");
});

router.post("/suggestion", (req, res) => {
  //latitue longtitue
  //return nearby place
  res.json("OK");
});



router.post("/passing", async (req, res) => {
  let coordinates = req.body.coordinates;
  //console.log(coordinates)
  if (!coordinates || coordinates.length === 0) return res.json("error");

  let origin = coordinates.origin;
  let destination = coordinates.destination;

  var near_results= [];
  var steps_results= [];

  let lat = coordinates.lat;
  let lng = coordinates.lng;
  let apiKey = process.env.GOOGLE_API_KEY;
  let r = 100;
  //console.log(radius)

  let main = {
    lat:lat,
    lng:lng
  }
  //near_results.push(main)



  let loopCars = car.getCarList();
  for (let i = 0; i < loopCars.length; i++) {
    let start = {
      lat: loopCars[i].destination.latitude.toFixed(14),
      lng: loopCars[i].destination.longitude.toFixed(14),
    };
    let end = {
      lat: loopCars[i].origin.latitude.toFixed(14),
      lng: loopCars[i].origin.longitude.toFixed(14),
    };

    await client
      .directions({
        params: {
          origin: start,
          destination: end,
          key: process.env.GOOGLE_API_KEY,
          mode: "DRIVING",
        },
        timeout: 15000,
        method: "GET",
      })
      .then(async(response) => {
        if (response.data.status !== "ZERO_RESULTS") {
          let ways = response.data.routes[0].legs[0].steps;

          for(let j=0;j<ways.length;j++){
            let ways_start = ways[j].start_location;
            let ways_end = ways[j].end_location;
            let result1 = {
              lat:ways_start.lat.toFixed(14),
              lng:ways_start.lng.toFixed(14)
            }
            let result2 = {
              lat:ways_end.lat.toFixed(14),
              lng:ways_end.lng.toFixed(14)
            }
            steps_results.push(result1)
            steps_results.push(result2)
            console.log(result1)
            console.log(result2)
            let all_way_result = Object.assign(result1,result2)
            steps_results.push(all_way_result)

           await fetch(
              `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${all_way_result.x},${all_way_result.y}&radius=${r}&key=${apiKey}`
            )
              .then((tresponse) => tresponse.json())
              .then((tresponseJson) => {
                //console.log(responseJson.results)
                for(let o=0;o<tresponseJson.results.length;o++){
                  let s_near = {
                    lat: tresponseJson.results[o].geometry.location.lat.toFixed(14),
                    lng: tresponseJson.results[o].geometry.location.lng.toFixed(14)
                  }
                  steps_results.push(s_near)
                }
                
                //res.json(near_results);
                //return;
            });


          }
         
        }
      })
      .catch((e) => {
        res.json(e.message);
        return;
      });

  }
  //var results = steps_results;
  var results = Object.assign(near_results,steps_results);

  for(let c=0;c<results.length;c++){
   
      if((calcCrow(results[c],main))<= 100){
        console.log(results[c].lat +","+results[c].lng)
        console.log(main.lat +","+main.lng)
        return res.json("founded!")
      }
    
  }

  return res.json("not found!");

  //return res.json(Object.assign(near_results,steps_results));
  
  //return res.json("ZERO_RESULTS");

  /*************************************
  var near_results= [];
  var steps_results= [];

  let lat = coordinates.lat;
  let lng = coordinates.lng;
  let apiKey = process.env.GOOGLE_API_KEY;
  let r = 100000;
  //console.log(radius)

  let main = {
    x:lat.toFixed( 2 ),
    y:lng.toFixed( 2 )
  }
  near_results.push(main)

  await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${r}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log(responseJson.results)
      for(let k=0;k<responseJson.results.length;k++){
        let near = {
          x: responseJson.results[k].geometry.location.lat.toFixed( 2 ),
          y:responseJson.results[k].geometry.location.lng.toFixed( 2 )
        }
        near_results.push(near)
      }
      
      //res.json(near_results);
      //return;
    });


  let loopCars = car.getCarList();
  for (let i = 0; i < loopCars.length; i++) {
    let start = {
      lat: loopCars[i].destination.latitude,
      lng: loopCars[i].destination.longitude,
    };
    let end = {
      lat: loopCars[i].origin.latitude,
      lng: loopCars[i].origin.longitude,
    };

    await client
      .directions({
        params: {
          origin: start,
          destination: end,
          key: process.env.GOOGLE_API_KEY,
          mode: "DRIVING",
        },
        timeout: 15000,
        method: "GET",
      })
      .then(async(response) => {
        if (response.data.status !== "ZERO_RESULTS") {
          let ways = response.data.routes[0].legs[0].steps;

          for(let j=0;j<ways.length;j++){
            let ways_start = ways[j].start_location;
            let ways_end = ways[j].end_location;
            let result1 = {
              x:ways_start.lat.toFixed( 2 ),
              y:ways_start.lng.toFixed( 2 )
            }
            let result2 = {
              x:ways_end.lat.toFixed( 2 ),
              y:ways_end.lng.toFixed( 2 )
            }
            steps_results.push(result1)
            steps_results.push(result2)

            let all_way_result = Object.assign(result1,result2)

            await fetch(
              `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${all_way_result.x},${all_way_result.y}&radius=${r}&key=${apiKey}`
            )
              .then((tresponse) => tresponse.json())
              .then((tresponseJson) => {
                //console.log(responseJson.results)
                for(let o=0;o<tresponseJson.results.length;o++){
                  let s_near = {
                    x: tresponseJson.results[o].geometry.location.lat.toFixed( 2 ),
                    y: tresponseJson.results[o].geometry.location.lng.toFixed( 2 )
                  }
                  steps_results.push(s_near)
                }
                
                //res.json(near_results);
                //return;
            });


          }
         
        }
      })
      .catch((e) => {
        return res.json(e.message);
      });

  }

  for(let c=0;c<near_results.length;c++){
    console.log(c,"mc")
    for(let n=0;n<steps_results.length;n++){
      //console.log(n)
      console.log(near_results[c], c)
      console.log(steps_results[n], n)
      if(near_results[c]===steps_results[n]){
        console.log("found!!")
        return res.json("founded!")
      }
    }
  }

  return res.json("not found!");

  //return res.json(Object.assign(near_results,steps_results));
**********************************************************************/
});

router.post("/nearby", (req, res) => {
  let coordinates = req.body.coordinates;
  let radius = req.body.radius;
  if (!coordinates || coordinates.length === 0) return res.json("error");
  //console.log(coordinates);
  //let latitude = coordinates.latitude;
  //let longtitude = coordinates.longitude;
  let lat = coordinates.latitude;
  let lng = coordinates.longitude;
  let apiKey = process.env.GOOGLE_API_KEY;

  //console.log(radius)
  fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log(responseJson.results)
      res.json(responseJson.results);
    });
});

router.post("/find", (req, res) => {
  let place = req.body.placeName;
  let coordinates = req.body.coordinates;
  if (!coordinates || coordinates.length === 0) return res.json("error");
  //console.log(coordinates);
  //let latitude = coordinates.latitude;
  //let longtitude = coordinates.longitude;
  let lat = coordinates.latitude;
  let lng = coordinates.longitude;
  let apiKey = process.env.GOOGLE_API_KEY;
  var pid;
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log(responseJson.results[0].place_id)
      pid = responseJson.results[0].place_id;
    })
    .then(() => {
      fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?fields=name,formatted_address&place_id=${pid}&key=${apiKey}`
      )
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson.result)
          res.json(responseJson.result);
          return;
        });
    });
});

router.post("/place", (req, res) => {
  let coordinates = req.body.coordinates;
  if (!coordinates || coordinates.length === 0) return res.json("error");
  //console.log(coordinates);
  //let latitude = coordinates.latitude;
  //let longtitude = coordinates.longitude;
  let lat = coordinates.latitude;
  let lng = coordinates.longitude;
  let apiKey = process.env.GOOGLE_API_KEY;
  var pid;
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log(responseJson.results[0].place_id)
      pid = responseJson.results[0].place_id;
    })
    .then(() => {
      fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?fields=name,formatted_address&place_id=${pid}&key=${apiKey}`
      )
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson.result)
          res.json(responseJson.result);
          return;
        });
    });
});

router.post("/calculate", (req, res) => {
  //calculate max paid
  let coordinates = req.body.coordinates;
  //console.log(coordinates)
  if (!coordinates || coordinates.length === 0) return res.json("error");
  let origin = coordinates.origin;
  let destination = coordinates.destination;
  client
    .directions({
      params: {
        origin: origin,
        destination: destination,
        key: process.env.GOOGLE_API_KEY,
        mode: "DRIVING",
      },
      timeout: 15000,
      method: "GET",
    })
    .then((response) => {
      if (response.data.status !== "ZERO_RESULTS") {
        let distance = response.data.routes[0].legs[0].distance.value;
        let resInfo = {
          price: ((distance / 1000) * 5).toFixed(0),
          //price: baht * 5
          distance: distance / 1000,
        };
        //console.log(price);
        let info = resInfo;
        res.json(info);
      } else {
        res.json("ZERO_RESULTS");
      }
    })
    .catch((e) => {
      res.json(e.message);
    });
});

router.post("/PassengerCurrentLocation", (req, res) => {
  //update position
  let id = req.body.passengerId;
  let data = req.body.currentPosition;
  let check = passengers.updateCurrentPositionByPassengerId(
    id,
    data.latitude,
    data.longitude
  );
  if (check != -1) {
    res.json("success");
    return;
  } else {
    res.json("error");
  }
});

router.post("/DriverCurrentLocation", (req, res) => {
  //update position
  let driverId = req.body.carId;
  let data = req.body.currentPosition;
  let check = car.updateCurrentPositionCarByDriverId(
    driverId,
    data.latitude,
    data.longitude
  );
  if (check !== -1) {
    res.json("success");
    return;
  } else {
    res.json("error");
  }
});

router.post("/driver/current", (req, res) => {
  var driver = car.getCarInfoByCarId(req.body.driverId);
  if(driver === -1) return res.json("error");
  return res.json(driver.coordinates)
})

module.exports = router;
