import React, { Component } from 'react'
import axios from 'axios';
import _, { reject } from 'lodash';
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = React.createContext()

class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      isAuthenticated: false,
      user: {},
      initPage: 'Home',
    }
  }

  componentDidMount = () => {
   this.getProfile();
   console.log("Getting user infomation.")
  }

  getProfile = async () => {
    axios.post('/user', {}, {
      headers:
        { 
          authorization: "Bearer " + await AsyncStorage.getItem("session_token") 
        }
    }).then( async (e) => {
      this.setState({ user: e.data, isAuthenticated: !_.isEmpty(e.data), initPage: "Lobby" }, () => {
        console.log("Done")
        this.setState({ init: true }, () => {
          SplashScreen.hide();
        })
      }); 
      
    }).catch((e) => {
      this.setState({ init: true }, () => {
        SplashScreen.hide();
      })
    })
  }

  updateContext = () => {
    console.log("Update Context!!!!")
    this.getProfile();
  }

  setOffInit =() => {
    this.setState({ init: false })
  }

  newRegisterInit = () => {
    this.setState({ init: false })
    return new Promise( async(resolve, reject) => {
      console.log("registersdfasdasd", await AsyncStorage.getItem("session_token") )
        axios.post('/user', {}, {
          headers:
            { 
              authorization: "Bearer " + await AsyncStorage.getItem("session_token") 
            }
        }).then( async (e) => {
          this.setState({ user: e.data, isAuthenticated: !_.isEmpty(e.data), initPage: "Lobby" }, () => {
            this.setState({ init: true }, () => {
              resolve(e.data)
            })
          }); 
          
        }).catch((e) => {
          reject(e)
        })
      })
  }

  clearSession = () => {
    // AsyncStorage.getAllKeys()
      //   .then(keys => AsyncStorage.multiRemove(keys))
      //   .then(() => alert('success'));
  }

  render() {
    return (
      <>
        {this.state.init &&
          <UserContext.Provider value={{ user: this.state.user, updateContext:this.updateContext, setOffInit:this.setOffInit, isAuthenticated: this.state.isAuthenticated, initPage: this.state.initPage, newRegisterInit: this.newRegisterInit}}>
            {this.props.children}
          </UserContext.Provider>
        }

      </>
    )
  }
}

export default UserContext

export { UserProvider }