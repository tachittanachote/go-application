const utils = require("./components/utils")
const users = require("./models/user")
console.log(require('crypto').randomBytes(64).toString('hex'))
const car = require("./models/car");
console.log(utils.formatPhoneNumber("0973279939"))

const generateUniqueId = require("generate-unique-id");
const id = generateUniqueId({
    length: 8,
    useLetters: false
  });
console.log(id)

console.log(utils.validateEmail("s3232@gmail.com"))

users.addUser({id:123,state:"test"})
users.addUser({id:1234,state:"test2"})
users.updateState(123, "UPDATED")
console.log("user--------------------------------",users.getUserStateById(123))



exports.runTest = () => {
  driver1 = {
    id: 80,
    name: "คุณบาลอน",
    start_lat: 13.7215486,
    start_long: 101.2022755,
    currentLat: 13.7184161,
    currentLong: 101.294593,
    destinationLat: 13.7184161,
    destinationLong: 101.194593,
  };


  driver2 = {
    id: 81,
    name: "โทนี สตาร์ก",
    start_lat: 13.7215486,
    start_long: 101.2022755,
    currentLat: 13.857108,
    currentLong: 100.521652,
    destinationLat: 14.0437,
    destinationLong: 100.2759,
  };
  
  driver3 = {
    id: 82,
    name: "สตีฟ โรเจอร์",
    start_lat: 13.7195084,
    start_long: 101.1957178,
    currentLat: 13.7195084,
    currentLong: 101.1957178,
    destinationLat: 13.7207092,
    destinationLong: 101.200383,
  };
  driver4 = {
    id: 83,
    name: "บรูซ",
    start_lat: 13.6553676,
    start_long: 100.4977553,
    currentLat: 13.6553676,
    currentLong: 100.4977553,
    destinationLat: 13.7194823,
    destinationLong: 101.1980094,
  };
  theklaoww = {
    id: 84,
    name: "คลินท์ บาร์ตัน klaoww",
    start_lat: 13.650409803825584, 
    start_long: 100.4979385475419,
    currentLat: 13.650409803825584, 
    currentLong: 100.4979385475419,
    destinationLat: 13.654531362615987, 
    destinationLong: 100.49436295993901,
  };

  
  //console.log(driver1)
  
  passenger1 = {
    id: 85,
    name: "คุณบาลอน",
    startLat: Math.floor(Math.random() * 101),
    startLong: Math.floor(Math.random() * 101),
    destinationLat: Math.floor(Math.random() * 101),
    destinationLong: Math.floor(Math.random() * 101),
  };
  passenger2 = {
    id: 86,
    name: "คลินท์ บาร์ตัน",
    startLat: Math.floor(Math.random() * 101),
    startLong: Math.floor(Math.random() * 101),
    destinationLat: Math.floor(Math.random() * 101),
    destinationLong: Math.floor(Math.random() * 101),
  };
  
  passenger3 = {
    id: 87,
    name: "บรูซ",
    startLat: Math.floor(Math.random() * 101),
    startLong: Math.floor(Math.random() * 101),
    destinationLat: Math.floor(Math.random() * 101),
    destinationLong: Math.floor(Math.random() * 101),
  };
  
  
  passenger4 = {
    id: 89,
    name: "โทนี สตาร์ก",
    startLat: Math.floor(Math.random() * 101),
    startLong: Math.floor(Math.random() * 101),
    destinationLat: Math.floor(Math.random() * 101),
    destinationLong: Math.floor(Math.random() * 101),
  };
  
  const carInfo = {
    registration: "AB123",
    color: "Black",
    model: "BMW",
  }
  
  let options = {
    gender: "male",
  }

  car.addCar(driver1, 4, carInfo).then(car.updateOptions(driver1.id, options));

  console.log("IBOTTTT",car.getCarByDriverId(80))

  car.addCar(driver2, 4, carInfo).then(car.updateOptions(driver2.id, options));
  car.addCar(driver3, 2, carInfo).then(car.updateOptions(driver3.id, {gender: "female"}));
  car.addCar(driver4, 1, carInfo).then(car.updateOptions(driver4.id, {gender: "female"}));
  car.addCar(theklaoww, 1, carInfo).then(car.updateOptions(theklaoww.id, {gender: "female"}));
  
  
  //car.addPassenger(driver1.id, passenger1);
  //car.addPassenger(driver1.id, passenger2);
  //car.addPassenger(driver1.id, passenger3);
  console.log('------bill-----')
  let a = car.removePassenger(driver1.id, passenger2.id, 99 , 88);
  ///console.log(a[0].node);
  console.log('---------------')
  //console.log(car.getCarInfoByCarId(80).car.carInfo)
  //car.addPassenger(driver1.id, passenger4);
  //console.log(car.getSeatsAmountByCarId(84))
  //console.log(car.getSeatsAmountByCarId(80))
  ///console.log(car.getCarList());

  var testFilter = car.filterOptions(1, "female");
  //console.log(testFilter)
  //console.log(car.getCarList())

}


