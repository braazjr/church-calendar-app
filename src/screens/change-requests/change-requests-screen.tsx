import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import { styles } from './styles'
import { getLoggedUser } from '../../services/authentication';
import { mainStyle } from '../../../config/styles';
import { deleteChangeRequest, doneChangeRequest, getChangeRequests } from '../../services/change-requests.service';

export default class ChangeRequestsScreen extends Component {
  state = {
    changeRequests: [],
    loggedUserId: undefined
  };

  componentDidMount() {
    this.loadChangeRequests()
  }

  async loadChangeRequests() {
    getChangeRequests()
      .then(async data => {
        const loggedUser = await getLoggedUser()

        this.setState({
          changeRequests: data,
          loggedUserId: loggedUser.id
        })
      });
  }

  render() {
    const {
      state: {
        changeRequests,
        loggedUserId
      },
    } = this;

    return (
      <>
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS == 'android' ? 26 : 50,
            backgroundColor: '#fff'
          }}
        >
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height - 100,
              marginTop: 10,
            }}
          >
            <Text style={styles.title}>
              trocas
            </Text>
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 100,
              }}
            >
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
      </>
    );
  }
}
