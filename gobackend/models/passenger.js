const passengerList = [];
const bookingPassengerList = []

exports.createPassengerBooking = (user) =>{
  if(user != undefined){
    let passenger = {
      id: user.id,
      currentLat: user.latitude,
      currentLong: user.longitude
    }
    bookingPassengerList.push(passenger);
    return 1;
  }
    return -1;
}

exports.getPassengerBookingById = (id) =>{
    for(var i = 0; i < bookingPassengerList.length; i++){
        if(bookingPassengerList[i].id === id){
          return bookingPassengerList[i];
        }
      }

    return -1;
}

exports.removePassengerBooking = (id) =>{
    for(var i = 0; i < bookingPassengerList.length; i++){
        if(bookingPassengerList[i].id === id){
          bookingPassengerList.splice(i, 1)
          return 1;
        }
      }

    return -1;
}


exports.createPassengerWhileCalling = (user) =>{
  if(user != undefined){
    let passenger = {
      id: user.id,
      currentLat: user.latitude,
      currentLong: user.longitude
    }
    passengerList.push(passenger);
    return 1;
  }
    return -1;
}

exports.getPassengerById = (id) =>{
    for(var i = 0; i < passengerList.length; i++){
        if(passengerList[i].id === id){
          return passengerList[i];
        }
      }

    return -1;
}

exports.removePassengerWhilegetOff = (id) =>{
    for(var i = 0; i < passengerList.length; i++){
        if(passengerList[i].id === id){
          passengerList.splice(i, 1)
          return 1;
        }
      }

    return -1;
}

exports.updateCurrentPositionByPassengerId = (id, lat, long) =>{
    for(var i = 0; i < passengerList.length; i++){
        if(passengerList[i].id === id){
          let passenger = passengerList[i]
          passenger.currentLat = lat;
          passenger.currentLong = long;
          return 1;
        }
      }
    return -1;
}