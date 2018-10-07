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
    TextInput,
    ScrollView
} from 'react-native';
import Tts from 'react-native-tts';
import axios from 'axios';
import SpeechAndroid from 'react-native-android-voice';

export default class ChatPage extends Component {

    constructor(props) {
        super(props);
        this.onSpeak = this.onSpeak.bind(this);
        this.state = {
            showMessage: [
                {
                    value: `Hello ${this.props.username}! What can I help you with?`,
                    key: new Date().toUTCString(),
                    styleClass: 'responseText'
                }
            ],
            inputMessage: ''
        };
    }

    componentWillMount() {
        Tts.speak(`Hello ${this.props.username}! What can I help you with`);
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
            <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    <FlatList
                        data={messages}
                        keyExtractor={item => item.key}
                        renderItem={({item}) => <Text style={item.styleClass === 'spokenText'? styles.spokenText: styles.responseText}>{item.value}</Text>}
                    />
                    <View style={{justifyContent: 'flex-end'}}>
                        <View style={styles.inputBox}>
                            <TextInput
                                placeholder="Type your message here"
                                onChangeText={this.handleInputText}
                                value={this.state.inputMessage}
                            />
                        </View>
                        <Button
                            style={styles.transparentButton}
                            onPress={this.onSpeak}
                            title="Press to talk"
                            accessibilityLabel="Press to talk"
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        padding: 5
    },
    responseText: {
        fontSize: 15,
        textAlign: 'left',
        fontFamily: 'Verdana',
        padding : 6,
        color: '#595856',
        backgroundColor: '#fff'
    },
    spokenText: {
        fontSize: 15,
        textAlign: 'right',
        fontFamily: 'Verdana',
        marginBottom: 4,
        color: '#595856',
        backgroundColor: '#fff'
    },
    transparentButton: {
        borderColor: '#ec008c',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        color:'#ec008c'
    },
    scroll: {
        backgroundColor: '#E1D7D8',
        padding: 30,
        flexDirection: 'column'
    },
    inputBox: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 10,
    }
});

