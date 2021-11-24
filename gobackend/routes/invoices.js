const express = require("express");
const router = express.Router();
const car = require("../models/car");
const passengers = require("../models/passenger");
const users = require("../models/user");

router.post('/', (req, res) => {
    res.json("OK");
});

router.post("/billToPassenger", (req, res) => {
  //for driver
  //call when "/cars/dropPassenger" had call
  //when driver will drop passenger bill will add to passenger on car
  //console.log(req.body)
  let passenger = req.body.passenger;
  let bill = req.body.bill;
  let carId = req.body.carId;

  info = {
    passengerId: passenger.id,
    distance: bill.distance,
    price: bill.price,
  };

  console.log(info)

  if (car.addPassengerBill(carId, passenger.id, info) !== -1) {
    console.log("send bill success")
    return res.json("success");
  }
  res.json("error");

});

router.post('/check', (req, res) => {
  //for passenger
  //when driver drop ->> check bill paasenger on car have
  let driver = req.body.driver;
  let passenger = req.body.passenger;
  let passengersOnCar = car.getPassengersByDriverId(driver.id);
  let passengersBill = car.getPassengerBillsByDriverId(driver.id);
  //console.log(passengers);
  var billingInfo = null;
  console.log(passengersBill.length)
  if(passengersBill.length > 0){
    for (bill of passengersBill) {
      console.log(bill)
      if (bill.passengerId === passenger.id) {
        //console.log(bill.passengerId)
        billingInfo = bill;
        console.log("info bill ",billingInfo)
        res.json(billingInfo);
        return;
      }
    }
    res.json("empty");
    return;
  }else{
    res.json("empty");
  }

  //console.log(passengersBill)
  
});

router.post('/confirm', (req, res) => {
  //passenger confirm pay
  let passenger = req.body.user;
  let carId = req.body.carId;
  if(car.getCarByDriverId(carId) === -1){
    return res.json("success");
  }else{
    if (car.removePassengerBill(carId, passenger) !== -1) {
      users.removeUserById(passenger.id);
      return res.json("success");
    }
    res.json("error");
  }
  
});



module.exports = router;