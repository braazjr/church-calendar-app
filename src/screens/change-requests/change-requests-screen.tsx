import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {styles} from './styles';
import {getLoggedUser} from '../../services/authentication';
import {mainStyleColors, mainStyles} from '../../../config/styles';
import {
  deleteChangeRequest,
  doneChangeRequest,
  changeRequestCollection,
} from '../../services/change-requests.service';
import LoadingComponent from '../../components/loading.component';

export default class ChangeRequestsScreen extends Component {
  state = {
    changeRequests: [],
    isLoading: false,
    loggedUserId: undefined,
    isRefreshing: false,
  };

  componentDidMount() {
    this.setState({isLoading: true});
    this.loadChangeRequests();
  }

  async loadChangeRequests() {
    const user = await getLoggedUser();

    let collection = changeRequestCollection as any;

    if (user.ministers && user.ministers.length > 0) {
      collection = collection.where(
        'task.minister.id',
        'in',
        user.ministers || [],
      );
      // .where('task.date', '>=', firestore.Timestamp.now())
    }

    collection.onSnapshot(async observer => {
      const data = (observer.docs || []).map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const loggedUser = await getLoggedUser();

      this.setState({
        changeRequests: data,
        loggedUserId: loggedUser.id,
        isLoading: false,
        isRefreshing: false,
      });
    });
  }

  render() {
    const {
      state: {changeRequests, isLoading, loggedUserId, isRefreshing},
    } = this;

    return (
      <>
        <LoadingComponent isLoading={isLoading}>
          <View
            style={{
              flex: 1,
              // marginTop: hasNotch() ? 50 : 20,
              marginTop: 50,
              backgroundColor: '#fff',
            }}>
            <View
              style={{
                width: '100%',
                height: Dimensions.get('window').height,
                marginTop: 10,
              }}>
              <Text style={styles.title}>trocas</Text>
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: '10%',
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => {
                      this.componentDidMount();
                    }}
                  />
                }>
                {changeRequests.length == 0 && (
                  <View
                    style={[
                      styles.listContent,
                      {
                        alignContent: 'center',
                        flexDirection: 'column',
                        padding: 20,
                        backgroundColor: 'rgba(230, 166, 45, 0.5)',
                      },
                    ]}>
                    <Text
                      style={{
                        flex: 1,
                        color: 'black',
                        fontSize: 18,
                        fontWeight: '700',
                        marginBottom: 10,
                      }}>
                      sem trocas!
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: 'black',
                        fontSize: 14,
                        textAlign: 'center',
                      }}>
                      se voc?? deseja solicitar uma troca,{'\n'}
                      v?? at?? sua escala e clique no{'\n'}
                      bot??o chamado 'n??o posso no dia'.{'\n'}
                      com isso, seus amigos de minist??rio{'\n'}
                      poder??o te substituir!
                    </Text>
                  </View>
                )}
                {changeRequests.map(item => (
                  <View
                    key={item.id}
                    style={[
                      mainStyles.cardList,
                      {
                        height: 'auto',
                        borderRightColor: item.task.minister.color,
                        borderRightWidth: 10,
                        backgroundColor: item.done
                          ? mainStyleColors.primaryOpacityColor
                          : mainStyleColors.primaryColor,
                      },
                    ]}>
                    {!item.done && (
                      <View
                        style={{
                          flex: 1,
                          alignSelf: 'center',
                        }}>
                        {item.task.ministry.id == loggedUserId ? (
                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert(
                                'exclus??o de troca',
                                `voc?? deseja excluir sua solicita????o de troca?`,
                                [
                                  {
                                    text: 'sim',
                                    style: 'destructive',
                                    onPress: () => {
                                      deleteChangeRequest(item.id).then(() => {
                                        this.loadChangeRequests();
                                      });
                                    },
                                  },
                                  {
                                    text: 'n??o',
                                    style: 'cancel',
                                  },
                                ],
                              );
                            }}>
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
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert(
                                'solicita????o de troca',
                                `voc?? aceita substituir ${
                                  item.task.ministry.name
                                } no dia ${moment(item.task.date).format(
                                  'DD/MM/YY',
                                )}?`,
                                [
                                  {
                                    text: 'sim',
                                    style: 'destructive',
                                    onPress: () => {
                                      doneChangeRequest(item.id).then(() => {
                                        this.loadChangeRequests();
                                      });
                                    },
                                  },
                                  {
                                    text: 'n??o',
                                    style: 'cancel',
                                  },
                                ],
                              );
                            }}>
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
                        )}
                      </View>
                    )}
                    <View
                      style={{
                        marginRight: 20,
                        paddingVertical: 20,
                        flex: 5,
                      }}>
                      <View>
                        <Text
                          style={{
                            color: item.done ? '#0000006b' : '#fff',
                            fontSize: 18,
                            fontWeight: '700',
                            textAlign: 'right',
                            width: '100%',
                            margin: 3,
                          }}>
                          {item.task.ministry.name}
                        </Text>
                        <Text
                          style={{
                            color: item.done ? '#0000006b' : '#fff',
                            fontSize: 14,
                            fontWeight: '700',
                            textAlign: 'right',
                            width: '100%',
                            margin: 3,
                          }}>
                          {item.task.minister.name}
                        </Text>
                        {item.task?.functions.length > 0 && (
                          <Text
                            style={{
                              color: item.done ? '#0000006b' : '#fff',
                              fontSize: 14,
                              fontWeight: '700',
                              textAlign: 'right',
                              width: '100%',
                              margin: 3,
                            }}>
                            [{item.task.functions.join(' & ')}]
                          </Text>
                        )}
                      </View>
                      <View>
                        <Text
                          style={{
                            color: item.done ? '#0000006b' : '#fff',
                            fontSize: 14,
                            marginTop: 10,
                            textAlign: 'right',
                          }}>
                          data:{' '}
                          {moment(item.task.date.toDate()).format(
                            'DD/MM/YY HH:mm',
                          )}
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
