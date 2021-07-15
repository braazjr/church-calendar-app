import React, { Component, } from "react";
import { Image, Platform, StatusBar, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from "./styles";
import { mainStyleColors } from "../../../config/styles";
import { signInWithApple, signInWithGoogle } from "../../services/authentication";
import LoadingComponent from "../../components/loading.component";

export default class LoginScreen extends Component {
    state = {
        isLoading: false
    }

    render() {
        const { isLoading } = this.state

        return (
            <>
                <LoadingComponent
                    isLoading={isLoading}
                >
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
                                backgroundColor: mainStyleColors.primaryColor
                            }]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ isLoading: true })
                                    signInWithGoogle()
                                        .finally(() => setTimeout(() => this.setState({ isLoading: false }), 2000))
                                }}
                                style={[styles.signIn, {
                                    backgroundColor: mainStyleColors.secondayColor,
                                    marginTop: 15,
                                    marginBottom: 15,
                                }]}
                            >
                                <Icon
                                    name="google"
                                    size={20}
                                    color={mainStyleColors.primaryColor} />
                            </TouchableOpacity>
                            {
                                Platform.OS == 'ios' &&
                                (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ isLoading: true })
                                            signInWithApple()
                                                .finally(() => setTimeout(() => this.setState({ isLoading: false }), 2000))
                                        }}
                                        style={[styles.signIn, {
                                            backgroundColor: mainStyleColors.secondayColor,
                                        }]}
                                    >
                                        <Icon
                                            name="apple"
                                            size={20}
                                            color={mainStyleColors.primaryColor} />
                                    </TouchableOpacity>
                                )
                            }
                        </Animatable.View>
                    </View>
                </LoadingComponent>
            </>
        )
    }
}