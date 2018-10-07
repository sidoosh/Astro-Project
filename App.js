/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ToastAndroid,
    Button,
    FlatList,
    TextInput
} from 'react-native';
import Tts from 'react-native-tts';
import axios from 'axios';
import SpeechAndroid from 'react-native-android-voice';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.onSpeak = this.onSpeak.bind(this);
        this.state = {
            showMessage: [],
            inputMessage: ''
        };
    }

    async onSpeak() {
        try{
            let spokenText;
            if(this.state.inputMessage === '') {
                spokenText = await SpeechAndroid.startSpeech("Speak yo", SpeechAndroid.DEFAULT)
                    .then((res) => {
                        this.setState({
                            showMessage: this.state.showMessage.concat(
                                {
                                    value: res,
                                    key: new Date().toUTCString(),
                                    styleClass: 'spokenText'
                                })
                        });
                        return res;
                    });
            } else {
                spokenText = this.state.inputMessage;
                this.setState({
                    showMessage: this.state.showMessage.concat(
                        {
                            value: spokenText,
                            key: new Date().toUTCString(),
                            styleClass: 'spokenText'
                        })
                });
            }

                const reply = await fetch(`http://192.168.1.4:5000/getmsg/${spokenText}`)
                    .then(res => res.json())
                    .then(message => {
                        Tts.speak(message[spokenText]);
                        return message[spokenText]
                    })
                    .catch(err => console.log(err));

                this.setState({
                    showMessage: this.state.showMessage.concat(
                        {
                            value: reply,
                            key: new Date().toUTCString(),
                            styleClass: 'responseText'
                        }),
                    inputMessage: ''
                });

        }catch(error){
            switch(error){
                case SpeechAndroid.E_VOICE_CANCELLED:
                    ToastAndroid.show("Voice Recognizer cancelled" , ToastAndroid.LONG);
                    break;
                case SpeechAndroid.E_NO_MATCH:
                    ToastAndroid.show("No match for what you said" , ToastAndroid.LONG);
                    break;
                case SpeechAndroid.E_SERVER_ERROR:
                    ToastAndroid.show("Google Server Error" , ToastAndroid.LONG);
                    break;
                /*And more errors that will be documented on Docs upon release*/
            }
        }
    }

    handleInputText = (val) => {
        this.setState({
            inputMessage: val
        })
    };
    render() {
        const messages = this.state.showMessage;
        return (
            <View style={styles.container}>
                <FlatList
                    data={messages}
                    keyExtractor={item => item.key}
                    renderItem={({item}) => <Text style={item.styleClass === 'spokenText'? styles.spokenText: styles.responseText}>{item.value}</Text>}
                />
                <View>
                    <TextInput
                        placeholder="Type here to translate!"
                        onChangeText={this.handleInputText}
                        value={this.state.inputMessage}
                    />
                    <Button
                        style={styles.button}
                        onPress={this.onSpeak}
                        title="Press to talk or type"
                        color="#37B6DF"
                        accessibilityLabel="Press to talk"
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
    },
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: '#F5FCFF',
        justifyContent: 'flex-start',
    },
    responseText: {
        fontSize: 20,
        textAlign: 'left',
    },
    spokenText: {
        fontSize: 20,
        textAlign: 'right',
    },
    action: {
        textAlign: 'center',
        color: '#0000FF',
        marginVertical: 5,
        fontWeight: 'bold',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    stat: {
        textAlign: 'center',
        color: '#B0171F',
        marginBottom: 1,
    },
});

