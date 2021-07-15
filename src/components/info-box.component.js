import React, { Component } from "react";
import { Text, View } from "react-native";
import { mainStyleColors } from "../../config/styles";

export default class InfoBoxComponent extends Component {
    state = {
    }

    componentDidMount() {
    }

    render() {
        const { title, description } = this.props;

        return (
            <>
                <View
                    style={[
                        {
                            height: 'auto',
                            width: '90%',
                            alignSelf: 'center',
                            borderRadius: 10,
                            backgroundColor: mainStyleColors.primaryColor,
                            marginTop: 10,
                            marginBottom: 10,
                            shadowOffset: {
                                width: 3,
                                height: 3,
                            },
                            shadowRadius: 5,
                            shadowOpacity: 0.2,
                            elevation: Platform.OS == 'android' ? 0 : 3,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            alignContent: 'center',
                            flexDirection: 'column',
                            padding: 20,
                            backgroundColor: 'rgba(230, 166, 45, 0.5)',
                        }]}
                >
                    {
                        title &&
                        (
                            <Text
                                style={{
                                    flex: 1,
                                    color: 'black',
                                    fontSize: 18,
                                    fontWeight: '700',
                                    marginBottom: 10,
                                }}
                            >
                                {title}
                            </Text>
                        )
                    }
                    <Text
                        style={{
                            flex: 1,
                            color: 'black',
                            fontSize: 14,
                            textAlign: 'center',
                        }}
                    >
                        {description}
                    </Text>
                </View>
            </>
        );
    }
}
