import React, {Component} from 'react';
import Logo from '../assets/astro_share.png';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TextInput,
    Image,
    ScrollView
} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogged: false
        };
    }

    handleInputName = (val) => {
        this.setState({
            inputName: val
        })
    }

    handleInputPassword = (val) => {
        this.setState({
            password: val
        })
    }

    onLoginPress = () => {
        this.setState({isLogged: true});
        Actions.chat({
            username: this.state.inputName
        })
    }

    render() {
        return (
            <ScrollView style={styles.scroll}>
                <View style={{objectFit: 'contain'}}>
                    <Image
                        style={{width: '100%', height: 120}}
                        source={Logo}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.textLabel}>
                        Username or Email
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={this.handleInputName}
                        value={this.state.inputName}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.textLabel}>
                        Password
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={this.handleInputPassword}
                        value={this.state.password}
                    />
                </View>
                <TouchableHighlight
                    style={styles.transparentButton}
                    title="Login"
                    underlayColor="#ccc"
                    onPress={this.onLoginPress}
                >
                    <Text style={{color:'#ec008c', fontSize: 18}}>Login</Text>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    container: {
        marginBottom: 20
    },
    textLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Verdana',
        marginBottom: 10,
        color: '#595856'
    },
    textInput: {
        height: 40,
        fontSize: 18,
        backgroundColor: '#FFF'
    },
    scroll: {
        backgroundColor: '#E1D7D8',
        padding: 30,
        flexDirection: 'column'
    },
    transparentButton: {
        marginTop: 30,
        borderColor: '#ec008c',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
});

