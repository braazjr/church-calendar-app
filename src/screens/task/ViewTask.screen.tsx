import React, { Component } from 'react';
import { Alert, Dimensions, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import { styles } from './styles';
import { Task } from '../../models/task-model';
import { getMinisters } from '../../services/minister';
import { Minister } from '../../models/minister.model';
import { User } from '../../models/user.model';
import { createChangeRequest } from '../../services/change-requests.service';
import { mainStyles } from '../../../config/styles';

const { width: vw, height: visibleHeight } = Dimensions.get('window');

export default class ViewTaskScreen extends Component {
    state = {
        itemSaved: new Task(),
        minister: new Minister(),
        availableFunctions: [],
        ministry: new User(),
        functions: [],
        date: undefined,
        taskId: undefined,
    }

    async componentDidMount() {
        const {
            id: taskId,
            date,
            minister,
            ministry,
            functions,
        } = this.props['route'].params.itemSaved || {}

        await this.getMinisters(minister);

        this.setState({ ministry, functions, date, taskId })
    }

    async getMinisters(minister = undefined) {
        let ministerData = await getMinisters()
            .doc(minister.id)
            .get()

        this.setState({
            minister: { id: ministerData.id, ...ministerData.data() },
            availableFunctions: ministerData.data().functions

        })
    }

    async _changeRequest() {
        const { taskId } = this.state

        return createChangeRequest(taskId)
    }

    render() {
        const {
            itemSaved,
            minister,
            availableFunctions,
            ministry,
            functions,
            date,
        } = this.state
        const { navigation } = this.props

        return (
            <>
                <View style={[
                    styles.container,
                    {
                        height: Platform.OS == 'android' ? '100%' : visibleHeight,
                        paddingTop: Platform.OS == 'android' ? 76 : 80,
                    }
                ]}>
                    <ScrollView
                        contentContainerStyle={{
                            paddingBottom: Platform.OS == 'android' ? 50 : 100,
                        }}
                    >
                        <View
                            style={{ flexDirection: 'row' }}
                        >
                            <View style={styles.backButton}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Home')}
                                    style={{ marginRight: vw / 2 - 120, marginLeft: 20 }}
                                >
                                    <Icon
                                        name="arrow-left"
                                        color={'#000'}
                                        size={30}
                                        style={{
                                            paddingLeft: 2,
                                            paddingTop: 2,
                                            alignSelf: 'center',
                                        }}
                                    />
                                </TouchableOpacity>

                            </View>
                            <Text style={styles.newTask}>sua escala</Text>
                        </View>
                        <View style={mainStyles.cardContainer}>
                            <View>
                                <Text
                                    style={{
                                        color: '#9CAAC4',
                                        fontSize: 14,
                                        fontWeight: '600',
                                    }}
                                >
                                    dia
                                </Text>
                                <View
                                    style={{
                                        height: 25,
                                        marginTop: 3,
                                    }}
                                >
                                    <Text style={{ fontSize: 19 }}>
                                        {moment(itemSaved.date).format('DD/MM/YYYY')}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.seperator} />

                            <View>
                                <Text
                                    style={{
                                        color: '#9CAAC4',
                                        fontSize: 14,
                                        fontWeight: '600',
                                    }}
                                >
                                    horário
                                </Text>
                                <View
                                    style={{
                                        height: 25,
                                        marginTop: 3,
                                    }}
                                >
                                    <Text style={{ fontSize: 19 }}>
                                        {moment(itemSaved.date).format('h:mm A')}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.seperator} />

                            <View>
                                <Text
                                    style={{
                                        color: '#9CAAC4',
                                        fontSize: 14,
                                        fontWeight: '600',
                                    }}
                                >
                                    ministério
                                    </Text>
                                <View
                                    style={{
                                        ...styles.title,
                                        borderLeftWidth: 3,
                                        borderColor: minister.color,
                                        marginTop: 10,
                                        marginBottom: 0,
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 19,
                                    }}>
                                        {(minister || {}).name}
                                    </Text>
                                </View>
                                <View style={styles.seperator} />
                            </View>

                            <View>
                                <Text
                                    style={{
                                        color: '#9CAAC4',
                                        fontSize: 14,
                                        fontWeight: '600',
                                    }}
                                >
                                    ministro
                                    </Text>
                                <View
                                    style={{
                                        ...styles.title,
                                        borderLeftWidth: 0,
                                        marginTop: 10,
                                        marginBottom: 0,
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 19,
                                    }}>
                                        {ministry.name}
                                    </Text>
                                </View>
                                <View style={styles.seperator} />
                            </View>

                            {
                                availableFunctions.length > 0 &&
                                (
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: '#BDC6D8',
                                                marginVertical: 10,
                                            }}
                                        >
                                            funções
                                            </Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {
                                                availableFunctions
                                                    .map((func, index) => ({
                                                        name: func,
                                                        index,
                                                        buttonStyle: (functions || []).indexOf(func) >= 0 ? styles.readBook : styles.readBookOff
                                                    }))
                                                    .map(func => (
                                                        <View
                                                            style={func.buttonStyle}
                                                            key={func.index}
                                                        >
                                                            <Text style={{ textAlign: 'center', fontSize: 14 }}>
                                                                {func.name}
                                                            </Text>
                                                        </View>
                                                    ))
                                            }
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                        {
                            moment().isBefore(date) && !itemSaved.hasOpenChangeRequest &&
                            (
                                <TouchableOpacity
                                    style={[
                                        styles.createTaskButton,
                                        {
                                            backgroundColor: '#a09c31',
                                            marginTop: 10,
                                        },
                                    ]}
                                    onPress={async () => {
                                        Alert
                                            .alert(
                                                'solicitação de troca',
                                                'deseja solicitar a troca?',
                                                [
                                                    {
                                                        text: 'sim',
                                                        style: 'destructive',
                                                        onPress: () => {
                                                            this._changeRequest()
                                                                .then(() => {
                                                                    navigation.navigate('Home')
                                                                })
                                                        }
                                                    },
                                                    {
                                                        text: 'não',
                                                        style: 'cancel'
                                                    }
                                                ]
                                            )
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            textAlign: 'center',
                                            color: '#fff',
                                        }}
                                    >
                                        não posso no dia
                        </Text>
                                </TouchableOpacity>
                            )
                        }
                    </ScrollView>
                </View>
            </>
        );
    }
}