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
import { GiftedChat, Send } from 'react-native-gifted-chat'

export default class ChatPage extends Component {

    constructor(props) {
        super(props);
        this.onSpeak = this.onSpeak.bind(this);
        this.state = {
            messages: [],
        };
    }

    componentWillMount() {
        Tts.speak(`Hello ${this.props.username}! What can I help you with`);
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: `Hello ${this.props.username}! What can I help you with`,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                    },
                },
            ],
        })
    }

    async onSpeak() {
        try{
            const spokenText = await SpeechAndroid.startSpeech("Speak yo", SpeechAndroid.DEFAULT)
                .then((res) => {
                    this.setState(previousState => {
                        const formattedMessage = [{
                            _id: Math.random()*10000000,
                            text: res,
                            createdAt: new Date(),
                            user: {
                                _id: 1
                            },
                        }];

                        return {
                            messages: GiftedChat.append(previousState.messages, formattedMessage),
                        }
                    });
                    return res;
                });

            const reply = await fetch(`http://192.168.1.4:5000/getmsg/${spokenText}`)
                .then(res => res.json())
                .then(message => {
                    Tts.speak(message[spokenText]);
                    return message[spokenText]
                })
                .catch(err => console.log(err));

            this.setState(previousState => {
                const formattedMessage = [{
                    _id: Math.random()*10000000,
                    text: reply,
                    createdAt: new Date(),
                    user: {
                        _id: 2
                    },
                }];

                return {
                    messages: GiftedChat.append(previousState.messages, formattedMessage),
                }
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

    async onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));

        const responseMsg = messages[0].text;

        const reply = await fetch(`http://192.168.1.4:5000/getmsg/${responseMsg}`)
            .then(res => res.json())
            .then(message => {
                Tts.speak(message[responseMsg]);
                return message[responseMsg]
            })
            .catch(err => console.log(err));

        this.setState(previousState => {
            const formattedMessage = [{
                _id: Math.random()*10000000,
                text: reply,
                createdAt: new Date(),
                user: {
                    _id: 2
                },
            }];

            return {
                messages: GiftedChat.append(previousState.messages, formattedMessage),
            }
        });
    }

    renderChatFooter() {
        return (
                <Button
                    style={{
                        borderColor: '#ec008c',
                        borderWidth: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        color:'#ec008c'
                    }}
                    onPress={this.onSpeak}
                    title="Press to talk"
                    accessibilityLabel="Press to talk"
                    color='#ec008c'
                />
        );
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id:1
                }}
                renderFooter ={() => (
                    <Button
                    style={{
                        borderColor: '#ec008c',
                        borderWidth: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        color:'#ec008c'
                    }}
                    onPress={this.onSpeak}
                    title="Press to talk"
                    accessibilityLabel="Press to talk"
                />)}

            />
        );
    }
}

const styles = StyleSheet.create({

    transparentButton: {
        borderColor: '#ec008c',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        color:'#ec008c'
    },
});

