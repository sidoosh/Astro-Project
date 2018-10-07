import React, {Component} from 'react';
import Login from './components/LoginPage'
import ChatPage from './components/ChatPage';
import {
    Router,
    Scene
} from 'react-native-router-flux';

export default class App extends Component {

    render() {

        return (
            <Router>
                <Scene key={'root'}>
                    <Scene key={'login'} component={Login} title={'Login'}/>
                    <Scene key={'chat'} component={ChatPage} title={'Chat'}/>
                </Scene>
            </Router>
        );
    }
}
