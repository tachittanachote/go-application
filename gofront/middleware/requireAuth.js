import React from 'react';
import { UserContext } from '../context';

export default function requireAuth(ComposedComponent) {
    class Authenticate extends React.Component {

        static contextType = UserContext;

        componentDidMount() {
            this.authCheck()
        }

        componentWillUnmount() {
            this.authCheck()
        }

        authCheck() {
            if(!this.context.isAuthenticated) {
                return this.props.navigation.navigate("Home")
            }
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    }

    return Authenticate;
}