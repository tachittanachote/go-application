const carList = [];

exports.getCarInfoByCarId = (carId) => {
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == carId){
      return {
        car: {
          carId: carList[i].carId,
          carInfo: carList[i].carInfo,
        },
        coordinates: {
          currentPosition: carList[i].currentPosition,
          origin: carList[i].origin,
          destination: carList[i].destination,
        }
      }
    }
  }
  return -1;
}

exports.addCar = (driver, avaliableSeat, carInfo, options) => {
  return new Promise((resolve, reject) => {
    if (this.findCarIdByDriverId(carList, "carId", driver.id) === -1) {
      let data = {
        carId: driver.id,
        carInfo: {
          registration: carInfo.registration,
          color: carInfo.color,
          model: carInfo.model,
        },
        avaliableSeat: avaliableSeat,
        bookingSeat: avaliableSeat,
        driverInfo: driver,
        currentPassenger: 0,
        bookingPassengers: [],
        passengers: [],
        passengersBill: [],
        origin: {
          latitude: driver.currentLat,
          longitude: driver.currentLong,
        },
        destination: {
          latitude: driver.destinationLat,
          longitude: driver.destinationLong, 
        },
        currentPosition:{
          latitude: driver.currentLat,
          longitude: driver.currentLong,
        },
        filterOption:{
          gender: "none",
        }
      };
      carList.push(data);
      resolve(data);
    }
    resolve(false);
  });
};


exports.filterOptions=(seat, gender)=>{
  let cars = carList.filter(car=>car.avaliableSeat >= seat);
  let result = cars.filter(car=>car.filterOption.gender === gender)
  return result;
}

exports.filterOptionGender=(gender)=>{
  //use like: car.filterOptionGender("female");
  //return [] car that filtered
  return carList.filter(car=>car.filterOption.gender === gender);
}
exports.filterOptionSeat=(seat)=>{
  //use like: car.filterOptionGender("female");
  //return [] car that filtered
  return carList.filter(car=>car.avaliableSeat === seat);
}

exports.updateOptions=(carId, options)=>{
  //use after add like: car.addCar(driver1, 4, carInfo).then(car.updateOptions(driver1.id, options));
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId === carId){
      console.log("SSKSKKSKK", options)
      carList[i].filterOption.gender = options.gender
      return 1;
    }
  }
  return -1;
}

exports.removeCar = (carId) =>{
  console.log(carId)
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == carId){
      console.log(carList[i].carId);
      carList.splice(i, 1);
      return 1;
    }
  }
  return -1;
}

exports.addPassengerBill = (carId, passengerId, info) =>{
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == carId){
      let bill = {
        passengerId: passengerId,
        distance: info.distance,
        price: info.price,
      }
      carList[i].passengersBill.push(bill);
      return 1;
    }
  }
  return -1;
}

exports.removePassengerBill = (carId, passenger) =>{
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == carId){
      let car = carList[i];
      for(let j =0;j<car.passengersBill.length;j++){
        if(car.passengersBill[j].passengerId === passenger.id){
          car.passengersBill.splice(j, 1);
          return 1;
        }
      }
    }
  }
  return -1;
}

exports.getPassengerBillsByDriverId = (carId) =>{
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == carId){
      return carList[i].passengersBill;
    }
  }
  return -1;
}

exports.bookingSeat = (carId, passenger) =>{
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == carId){
      //let seats = carList[i].bookingSeat;
      carList[i].bookingSeat = carList[i].bookingSeat - 1;
      let mypassenger = {
        id: passenger.id
      }
      carList[i].bookingPassengers.push(mypassenger);
      return 1;
    }
  }
  return -1;
}

exports.cancelBookingSeat = (carId, passenger) =>{
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == carId){
      //let seats = carList[i].bookingSeat;
      carList[i].bookingSeat = carList[i].bookingSeat + 1;
      for(let j =0;j<carList[i].bookingPassengers.length;i++){
        if(carList[i].bookingPassengers[j].id === passenger.id){
          carList[i].bookingPassengers.splice(j, 1);
          return 1;
        }
      }
      //carList[i].bookingPassengers.push(mypassenger);
    }
  }
  return -1;
}

exports.addPassenger = (carId, passenger) => {

  return new Promise((resolve, reject) => {

    let index = this.findCarIdByDriverId(carList, "carId", carId);

    if (index === -1) resolve(false);
    if (carList[index].avaliableSeat === 0) resolve(false);

    carList[index].avaliableSeat = carList[index].avaliableSeat - 1;
    carList[index].currentPassenger = carList[index].currentPassenger + 1;
    
    let nodePosition = {
      latitude: passenger.startLat,
      longitude: passenger.startLong,
      totalPassenger: carList[index].currentPassenger,
    }

    let data = {
      passengerInfo: {
        passengerId: passenger.id,
        passengerName: passenger.name,
        node: [nodePosition],
      },
    };

    if(carList[index].passengers.length > 0)
    {
      for(var i = 0; i < carList[index].passengers.length; i++){
          carList[index].passengers[i].passengerInfo.node.push(nodePosition);
      }
    }

    carList[index].passengers.push(data);
    resolve(true)
  })
};

exports.removePassenger = (carId, passenger) => {

  let billing = [];
  let index = this.findCarIdByDriverId(carList, "carId", carId);

  if(index === -1) return billing;

  let id = this.getArrayIndexByPassengerId(index, passenger.id);

  if(id === -1) return billing;

  /*
  let origin = {
    startLat: carList[index].passengers[id].passengerInfo.node[0].startLat,
    startLong: carList[index].passengers[id].passengerInfo.node[0].startLong,
    totalPassenger:
      carList[index].passengers[id].passengerInfo.node[0].totalPassenger,
  };

  billing.push(origin);

  let destination = {
    destinationLat: endLat,
    destinationLong: endLong,
    totalPassenger:
      carList[index].passengers[id].passengerInfo.node[0].totalPassenger,
  };

  billing.push(destination);
*/


  let currentPassengerAmonut = carList[index].currentPassenger;
  
  if(carList[index].passengers.length > 0)
    {
      for(var i = 0; i < carList[index].passengers.length; i++){
          let currentPassengerId = carList[index].passengers[i].passengerInfo.passengerId;
          let nodePosition = {
            latitude: passenger.endLat,
            longitude: passenger.endLong,
            totalPassenger: (currentPassengerId != passenger.id) ? currentPassengerAmonut-1:currentPassengerAmonut,
          }
          carList[index].passengers[i].passengerInfo.node.push(nodePosition);
        }
      }
    

  billing.push(carList[index].passengers[id].passengerInfo)


  carList[index].avaliableSeat = carList[index].avaliableSeat + 1;
  carList[index].bookingSeat = carList[index].bookingSeat +1; 
  carList[index].currentPassenger = carList[index].currentPassenger - 1;
  this.removePassengerById(carList[index].passengers, passenger.id);

  return billing;
};

exports.getCarByDriverId = (driverId) => {
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == driverId){
      return carList[i];
    }
  }
  return -1;
};

exports.getPassengersByDriverId = (driverId) => {
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == driverId){
      return carList[i].passengers;
    }
  }
  return -1;
};

exports.updateCurrentPositionCarByDriverId = (driverId, latitude, longitude) => {
  for(var i = 0; i < carList.length; i++){
    if(carList[i].carId == driverId){
      let car = carList[i]
      car.currentPosition.latitude = latitude;
      car.currentPosition.longitude = longitude;
      //console.log(carList[i])
      return 1;
    }
  }
  return -1;
};

exports.findCarIdByDriverId = (array, attr, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
};

exports.removePassengerById = (arr, value) => {
  var i = 0;
  while (i < arr.length) {
    if (arr[i].passengerInfo.passengerId === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
};

exports.getArrayIndexByPassengerId = (index, id) => {
  var index = carList[index].passengers
    .map(function (e) {
      return e.passengerInfo.passengerId;
    })
    .indexOf(id);

  return index
}

exports.getSeatsAmountByCarId = (carId) =>{
  for(var i = 0; i < carList.length; i++){
    if (carList[i].carId == carId) {
      return carList[i].bookingSeat;
    }
  }
  return -1;
}

exports.getCarList = () => {
  return carList;
};

exports.getTotalCarList = () => {
  return carList.length;
};

exports.moveSimulator = (carId) => {
   var e = Math.round(Math.random())
  car = this.getCarByDriverId(carId)
  if(car !== -1) {
    car.currentPosition.latitude = car.currentPosition.latitude + (Math.random() * 0.0000999),
    car.currentPosition.longitude = car.currentPosition.longitude + (Math.random() * 0.0000999);
  }
     //console.log("Moving a car id", carId);
}