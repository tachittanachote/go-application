const express = require("express");
const router = express.Router();
const car = require("../models/car");
const passengers = require("../models/passenger");
const users = require("../models/user");
const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

//-------------------for passenger
router.post("/", (req, res) => {
  //get all cars
  var options = req.body.options;
  var avaliableCars = [];

  console.log(options)
  
  //var cars = car.getCarList();
  var cars = car.filterOptions(options.seats, options.gender);

  for (var i = 0; i < cars.length; i++) {
    avaliableCars.push(car.getCarInfoByCarId(cars[i].carId));
  }

  console.log(avaliableCars)
  res.json(avaliableCars);
});

router.post("/call", (req, res) => {
  //push calling to driver
  let passenger = req.body.user;
  let carId = req.body.carId;

  passengers.createPassengerWhileCalling(passenger); //id, lat, long
  passengers.createPassengerBooking(passenger)

  if (car.bookingSeat(carId, passenger) > 0) {
    var carInfo = car.getCarByDriverId(carId);
    var driverInfo = {
      id: carInfo.carId,
      carInfo: car.getCarInfoByCarId(carId).car.carInfo,
      coordinates: {
        destination:{
          latitude: carInfo.destination.latitude,
          longitude: carInfo.destination.longitude
        }
      }
    }
    users.updateState(passenger.id, "WAIT", driverInfo);
    console.log("call success");
    res.json("success");
    return;
  }
  res.json("error");
  //res.json("success")
});

router.post("/cancelCall", (req, res) => {
  //push canceling call to driver
  let passenger = req.body.user;
  let carId = req.body.carId;

  passengers.removePassengerWhilegetOff(passenger.id);
  passengers.removePassengerBooking(passenger.id)

  if (car.cancelBookingSeat(carId, passenger) !== -1) {
    console.log("cancel Call success!");
    res.json("success");
    return;
  }
  res.json("error");
});

router.post("/confirm", (req, res) => {
  //passenger get in car
  let passenger = req.body.user;
  let carId = req.body.carId;
  if (car.getCarByDriverId(carId).avaliableSeat !== -1) {
    car.addPassenger(carId, passenger);
    //passengers.removePassengerWhilegetOff(passenger.id)
    passengers.removePassengerBooking(passenger.id)
    users.updateState(passenger.id, "TRAVEL");
    console.log("confirm success!");
    return res.json("success");
  }
  res.json("error");
});


router.post("/availableSeat/:id", (req, res) => {
  //check avaible seats on car
  let carId = req.params.id;
  let seat = car.getSeatsAmountByCarId(carId);
  //console.log(seat)
  res.json(seat);
});

//--------------------for driver

router.post("/pull", (req, res) => {
  let carId = req.body.carId;
  let driverCar = car.getCarByDriverId(carId);
  let passenger = driverCar.bookingPassengers;

  //console.log(carId)
  //console.log(driverCar)
  //console.log(passenger)

  if (passenger === undefined || driverCar == -1) {
    return res.json("error");
  }
  let passengersLocation = [];

  for (let i = 0; i < passenger.length; i++) {
    //let p = passengers.getPassengerById(passenger[i].id);
    let p = passengers.getPassengerBookingById(passenger[i].id);
    data = {
      id: p.id,
      latitude: p.currentLat,
      longitude: p.currentLong,
      currentCoordinate: {
        latitude: p.currentLat,
        longitude: p.currentLong,
      },
    };
    passengersLocation.push(data);
  }
  res.json(passengersLocation);
  return;
  
});

router.post("/start", (req, res) => {
  //start car driving
  let driver = req.body.driver;
  let carInfo = driver.carInfo;
  let options = req.body.filters;

console.log("Before Startttttttttt",options)

  //console.log(driver);
  if (driver) {
    car.addCar(driver, carInfo.seat , carInfo).then((e) => {
      if (e === false) {
        res.json("error");
        return;
      }

      if(options){
        console.log("IN IFFFFFF", options.gender)
        car.updateOptions(driver.id, options);
      }

      console.log("INfoooosaodososo",car.getCarByDriverId(driver.id))

      //console.log(e);
      users.updateState(driver.id, "DRIVE");
      res.json("success");
      return;
    }).catch(e => {
      console.log("errrorrr", e)
      res.json(e);
    });
  }
  //res.json("error");
});


router.post("/dropPassenger", async(req, res) => { //
  let passenger = req.body.passenger;
  //let driver = req.body.driver;
  let carId = req.body.carId;
  let bill = car.removePassenger(carId, passenger);
  //console.log("passenger")
  console.log(passenger.passengerName);
  //console.log(bill[0].passengerId)
  //console.log(bill[0].node) //use to find distant
  console.log(bill);
  if (bill.length !== 0) {
    let billInfo = bill[0];
    var thisPrice = 0;
    var distanceAmount = 0;

    for (let i = 0; i < billInfo.node.length; i++) {
      let node = billInfo.node[i];
      let nextNode = billInfo.node[i + 1];
   
      if (nextNode === undefined) {

        let resultBill = {
          price: thisPrice,
          distance: distanceAmount / 1000,
          passengerId: passenger.id,
          passengerName: passenger.passengerName,
        };
       

        //console.log(distanceAmount)
        //console.log(thisPrice)

        if (car.addPassengerBill(carId, passenger.id, resultBill) !== -1) {
          console.log(resultBill)
          console.log("send bill success")
          res.json(resultBill);
          return;
        }

        //res.json(resultBill);
        //return;
      } else {
        var origin = {
          lat: node.latitude,
          lng: node.longitude,
        };
        var destination = {
          lat: nextNode.latitude,
          lng: nextNode.longitude,
        };
        let peopleCount = node.totalPassenger;
        let rate = 0;

        //rate
        switch (peopleCount) {
          case 1:
            rate = 5;
            break;
          case 2:
            rate = 3;
            break;
          case 3:
            rate = 2;
            break;
          case 4:
            rate = 1;
            break;
          case 5:
            rate = 0.5;
            break;
          case 6:
            rate = 0.3;
            break;
        }

        await client
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
            //console.log("========================================= res")
            //console.log(response)
            let distance = response.data.routes[0].legs[0].distance.value;
            let calBill = parseInt(((distance / 1000) * rate).toFixed(0));

            distanceAmount = distanceAmount + distance;
            thisPrice = thisPrice + calBill;
            passengers.removePassengerWhilegetOff(passenger.id);
          })
          .catch((e) => {
            //console.log("catching error" + e)
            res.json(e)
            return;
          });
      }
    }
  }
  //res.json(utils.responseJson({ result: ["success"], statusCode: 200 }));
  res.json("error");
});

/*
  router.post("sendBillToPassenger", (req, res) => {
    let passenger = req.body.passenger;
    let bill = req.body.bill;
    let carId = req.body.carId;
  
    info = {
      passengerId: passenger.id,
      distance: bill.distance,
      price: bill.price,
    };
  
    if (car.addPassengerBill(carId, passenger.id, info) !== -1) {
      return res.json("success");
    }
    res.json("error");
  });*/

router.post("/checkPassengersInfo", (req, res) => {
  let driver = req.body.driver;
  let passengers = car.getPassengersByDriverId(driver.id);
  console.log(passengers);
  if (passengers) {
    return res.json(passengers);
  }
  res.json("error");
});

router.post("/done", (req, res) => {
  let carId = req.body.carId;
  if (car.removeCar(carId) !== -1) {
    users.removeUserById(carId);
    return res.json("success");
  }
  res.json("error");
});




module.exports = router;
