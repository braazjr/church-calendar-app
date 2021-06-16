import React, { Component, } from "react";
import { Image, Platform, StatusBar, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from "./styles";
import { mainStyle } from "../../../config/styles";
import { signInWithApple, signInWithGoogle } from "../../services/authentication";

export default class LoginScreen extends Component {
    state = {
    }

    render() {
        return (
            <>
                <View
                    style={{
                        flex: 1,
                        paddingTop: StatusBar.currentHeight,
                        backgroundColor: 'white'
                    }}
                >
                    <View style={styles.header}>
                        <Image
                            source={require('../../../assets/logo_branco.png')}
                            style={{
                                width: '60%',
                                height: '60%',
                                margin: 20
                            }}
                        />
                    </View>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={[styles.footer, {
                            backgroundColor: mainStyle.primaryColor
                        }]}
                    >
                        <TouchableOpacity
                            onPress={() => signInWithGoogle()}
                            style={[styles.signIn, {
                                backgroundColor: mainStyle.secondayColor,
                                marginTop: 15,
                                marginBottom: 15,
                            }]}
                        >
                            <Icon
                                name="google"
                                size={20}
                                color={mainStyle.primaryColor} />
                        </TouchableOpacity>
                        {
                            Platform.OS == 'ios' &&
                            (
                                <TouchableOpacity
                                    onPress={() => signInWithApple()}
                                    style={[styles.signIn, {
                                        backgroundColor: mainStyle.secondayColor,
                                    }]}
                                >
                                    <Icon
                                        name="apple"
                                        size={20}
                                        color={mainStyle.primaryColor} />
                                </TouchableOpacity>
                            )
                        }
                    </Animatable.View>
                </View>
            </>
        )
    }
}