import React, { Component } from "react";
import App from "./App";
import { UserProvider } from "./context";

class Main extends Component {
  render() {
    return (
      <UserProvider>
        <App/>
      </UserProvider>
    )
  }
}

export default Main;