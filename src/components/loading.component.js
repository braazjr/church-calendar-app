import React, { Component } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { mainStyle } from '../../config/styles';
import * as Animatable from 'react-native-animatable';

export default class LoadingComponent extends Component {
    state = {
        logoAnime: new Animated.Value(0),
        logotext: new Animated.Value(0),
    }

    componentDidMount() {
        const { logoAnime, logotext } = this.state

        Animated.parallel([
            Animated.spring(logoAnime, {
                useNativeDriver: false,
                toValue: 1,
                tension: 10,
                friction: 2,
            }),
            Animated.spring(logotext, {
                useNativeDriver: false,
                toValue: 1,
                tension: 10,
                friction: 2,
            }),
        ]).start(() => {
            this.setState({ isLoading: true })
        })
    }

    render() {
        const { isLoading, children } = this.props;

        return (
            <>
                {isLoading ? (
                    <View style={{
                        backgroundColor: mainStyle.secondayColor,
                        height: '100%'
                    }}>
                        <Animated.View
                            style={{
                                flex: 2,
                                justifyContent: 'flex-end',
                                paddingHorizontal: 20,
                                alignItems: 'center',
                                opacity: this.state.logoAnime,
                                top: this.state.logoAnime.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [80, 0],
                                })
                            }}
                        >
                            <Image
                                source={require('../../assets/logo_branco.png')}
                                style={{
                                    width: 300,
                                    height: 300,
                                    margin: 20
                                }}
                            />
                        </Animated.View>
                        <Animatable.View
                            animation="fadeIn"
                            style={{
                                flex: 1,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: mainStyle.primaryColor,
                                    fontSize: 16,
                                }}
                            >
                                carregando...
                            </Text>
                        </Animatable.View>
                    </View>
                ) : (
                    <>
                        <View style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: '#fff',
                        }}>
                            {children}
                        </View>
                    </>
                )
                }
            </>
        );
    }
}
