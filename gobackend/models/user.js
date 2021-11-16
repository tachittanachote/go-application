var usersList = [];

exports.getUser = () => {
    return usersList;
}

exports.addUser = (user) =>{
    console.log("Add", user)
    usersList.push({
        id :user.user_id, 
        state: user.state,
        driver: {
            carId: null,
            carInfo: {
                registration: null,
                color: null,
                model: null,
            },
            coordinates: {
                destination:{
                    latitude: null,
                    longitude: null
                }
            }
        }
    });
    return 1;
}

exports.updateState = (id, state, driver) =>{
    for(var i = 0; i<usersList.length; i++){
        if(usersList[i].id === id){
            usersList[i].state = state;
            console.log()
            if(state === "WAIT"){
                usersList[i].driver.carId = driver.id,
                usersList[i].driver.coordinates.destination.latitude = driver.coordinates.destination.latitude,
                usersList[i].driver.coordinates.destination.longitude = driver.coordinates.destination.longitude,
                usersList[i].driver.carInfo.registration = driver.carInfo.registration,
                usersList[i].driver.carInfo.color = driver.carInfo.color,
                usersList[i].driver.carInfo.model = driver.carInfo.model
            }/*else if(state === ""){

            }*/
            console.log("---------------- user state updated! -------------")
            return 1;
        }
    }
    return -1;
}

exports.getUserStateById = (id) =>{ 
    return usersList.filter(user => user.id == id);
}

exports.removeUserById = (id) =>{
    for(var i = 0; i<usersList.length; i++){
        if(usersList[i].id === id){
            usersList.splice(i ,1);
            return 1;
        }
    }
    return -1;
}