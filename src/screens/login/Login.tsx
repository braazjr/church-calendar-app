import React, { Component, } from "react";
import { Image, StatusBar, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { styles } from "./styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import { mainStyle } from "../../../config/styles";
import { signInWithGoogle } from "../../services/authentication";

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
                        {/* <Text style={styles.text_header}>Welcome!</Text> */}
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
                                marginBottom: 30,
                            }]}
                        >
                            <Icon
                                name="google"
                                size={20}
                                color={mainStyle.primaryColor} />
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </>
        )
    }
}