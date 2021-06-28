import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import { styles } from './styles'
import { getLoggedUser } from '../../services/authentication';
import { mainStyle } from '../../../config/styles';
import { deleteChangeRequest, doneChangeRequest, getChangeRequests } from '../../services/change-requests.service';
import LoadingComponent from '../../components/loading.component';
import { hasNotch } from '../../utils/device.util';

export default class ChangeRequestsScreen extends Component {
  state = {
    changeRequests: [],
    isLoading: false,
    loggedUserId: undefined
  };

  componentDidMount() {
    this.setState({ isLoading: true })
    this.loadChangeRequests()
  }

  async loadChangeRequests() {
    getChangeRequests()
      .then(async data => {
        const loggedUser = await getLoggedUser()

        this.setState({
          changeRequests: data,
          loggedUserId: loggedUser.id,
          isLoading: false
        })
      });
  }

  render() {
    const {
      state: {
        changeRequests,
        isLoading,
        loggedUserId,
      },
    } = this;

    return (
      <>
        <LoadingComponent
          isLoading={isLoading}
        >
          <View
            style={{
              flex: 1,
              marginTop: hasNotch() ? 50 : 20,
              backgroundColor: '#fff'
            }}
          >
            <View
              style={{
                width: '100%',
                height: Dimensions.get('window').height,
                marginTop: 10,
              }}
            >
              <Text style={styles.title}>
                trocas
            </Text>
              <ScrollView>
                {
                  changeRequests.length == 0 &&
                  (
                    <View
                      style={[
                        styles.listContent,
                        {
                          alignContent: 'center',
                          flexDirection: 'column',
                          padding: 20,
                          backgroundColor: 'rgba(230, 166, 45, 0.5)',
                        }]}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: 'black',
                          fontSize: 18,
                          fontWeight: '700',
                          marginBottom: 10,
                        }}
                      >
                        sem trocas!
                    </Text>
                      <Text
                        style={{
                          flex: 1,
                          color: 'black',
                          fontSize: 14,
                          textAlign: 'center',
                        }}
                      >
                        se você deseja solicitar uma troca,{'\n'}
                      vá até sua escala e clique no{'\n'}
                      botão chamado 'não posso no dia'.{'\n'}
                      com isso, seus amigos de ministério{'\n'}
                      poderão te substituir!
                    </Text>
                    </View>
                  )
                }
                {changeRequests.map(item => (
                  <View
                    key={item.id}
                    style={[
                      styles.listContent,
                      {
                        borderRightColor: item.task.minister.color,
                        borderRightWidth: 10,
                        backgroundColor: item.done ? mainStyle.primeryOpacityColor : mainStyle.primaryColor
                      }
                    ]}
                  >
                    {
                      !item.done &&
                      (
                        <View
                          style={{
                            flex: 1,
                            alignSelf: 'center',
                          }}
                        >
                          {
                            item.task.ministry.id == loggedUserId ?
                              (
                                <TouchableOpacity
                                  onPress={() => {
                                    Alert
                                      .alert(
                                        'exclusão de troca',
                                        `você deseja excluir sua solicitação de troca?`,
                                        [
                                          {
                                            text: 'sim',
                                            style: 'destructive',
                                            onPress: () => {
                                              deleteChangeRequest(item.id)
                                                .then(() => {
                                                  this.loadChangeRequests()
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
                                  <Icon
                                    name="trash"
                                    color={'#fff'}
                                    size={25}
                                    style={{
                                      alignSelf: 'flex-end',
                                      margin: 10,
                                    }}
                                  />
                                </TouchableOpacity>
                              )
                              :
                              (
                                <TouchableOpacity
                                  onPress={() => {
                                    Alert
                                      .alert(
                                        'solicitação de troca',
                                        `você aceita substituir ${item.task.ministry.name} no dia ${moment(item.task.date).format('DD/MM/YY')}?`,
                                        [
                                          {
                                            text: 'sim',
                                            style: 'destructive',
                                            onPress: () => {
                                              doneChangeRequest(item.id)
                                                .then(() => {
                                                  this.loadChangeRequests()
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
                                  <Icon
                                    name="exchange"
                                    color={'#fff'}
                                    size={25}
                                    style={{
                                      alignSelf: 'flex-end',
                                      margin: 10,
                                    }}
                                  />
                                </TouchableOpacity>
                              )
                          }
                        </View>
                      )
                    }<View
                      style={{
                        marginRight: 20,
                        paddingVertical: 20,
                        flex: 5
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: item.done ? '#0000006b' : '#fff',
                            fontSize: 22,
                            fontWeight: '700',
                            textAlign: 'right',
                            width: '100%',
                            margin: 3,
                          }}
                        >
                          {item.task.ministry.name}
                        </Text>
                        <Text
                          style={{
                            color: item.done ? '#0000006b' : '#fff',
                            fontSize: 16,
                            fontWeight: '700',
                            textAlign: 'right',
                            width: '100%',
                            margin: 3,
                          }}
                        >
                          {item.task.minister.name}
                        </Text>
                        {
                          item.task?.functions.length > 0 &&
                          (
                            <Text
                              style={{
                                color: item.done ? '#0000006b' : '#fff',
                                fontSize: 16,
                                fontWeight: '700',
                                textAlign: 'right',
                                width: '100%',
                                margin: 3,
                              }}
                            >
                              [{item.task.functions.join(' & ')}]
                            </Text>
                          )
                        }
                      </View>
                      <View>
                        <Text
                          style={{
                            color: item.done ? '#0000006b' : '#fff',
                            fontSize: 14,
                            marginTop: 10,
                            textAlign: 'right'
                          }}
                        >
                          data: {moment(item.task.date.toDate()).format('DD/MM/YY HH:mm')}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </LoadingComponent>
      </>
    );
  }
}
