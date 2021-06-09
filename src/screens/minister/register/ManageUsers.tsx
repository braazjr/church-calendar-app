import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Keyboard,
  TextInput,
} from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles';
import { addUserOnMinister, removeUserOnMinister } from '../../../services/minister';
import { getUsers, getUsersFromMinister } from '../../../services/user';

const { width: vw } = Dimensions.get('window');


export default class ManagerUsers extends Component {
  state = {
    selectedDate: moment(),
    currentDay: moment().format(),
    keyboardHeight: 0,
    visibleHeight: Dimensions.get('window').height,
    isDateTimePickerVisible: false,
    timeType: '',
    creatTodo: {},
    createEventAsyncRes: '',
    functions: [],
    itemSaved: {},

    availableFunctions: [],
    ministers: [],
    users: [],
    avaiableUsers: [],
    usersFound: [],
    ministerId: '',
    newUser: '',

    actionSheetMinisterOptions: [],
    actionSheetMinistryOptions: [],
  };

  async componentDidMount() {
    const {
    } = this;

    const {
      ministerId,
    } = this.props['route'].params || {}

    const users = await getUsersFromMinister(ministerId)
    const avaiableUsers = await getUsers()

    this.setState({
      users,
      avaiableUsers,
      ministerId
    })
  }

  _keyboardDidShow = e => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
      visibleHeight:
        Dimensions.get('window').height - e.endCoordinates.height - 30,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      visibleHeight: Dimensions.get('window').height,
    });
  };

  generateNewColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }

  render() {
    const {
      state: {
        visibleHeight,

        ministerId,
        newUser,
        users,
        avaiableUsers,
        usersFound,
      },
    } = this;

    return (
      <>
        <View style={styles.container}>
          <View
            style={{
              height: visibleHeight,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 100,
              }}
            >
              <View
                style={{ flexDirection: 'row', marginTop: 60 }}
              >
                <View style={styles.backButton}>
                  <TouchableOpacity
                    onPress={() => this.props['navigation'].navigate('ministérios')}
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
                <Text style={styles.caption}>gerencie ministros</Text>
              </View>



              <View style={styles.formContainer}>
                <View
                  style={{ marginBottom: 25 }}
                >
                  <TextInput
                    style={styles.title}
                    onChange={text => {
                      this.setState({ newUser: text.nativeEvent.text })

                      if (text.nativeEvent.text.length >= 3) {
                        this.setState({
                          usersFound: avaiableUsers
                            .filter(us => us.name.toLowerCase().includes(newUser.toLowerCase()) && !users.map(u => u.name).includes(us.name))
                        })
                      }
                    }}
                    value={newUser}
                    placeholder="pesquise novo ministro"
                  />
                </View>

                {usersFound.map(item => (
                  <View
                    key={item.id}
                    style={[
                      styles.listContent, {
                        width: '100%'
                      }
                    ]}
                  >
                    <View
                      style={{
                        marginHorizontal: 15,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1
                        }}
                      >
                        <Text
                          style={{
                            color: '#554A4C',
                            fontSize: 16,
                            fontWeight: '700',
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: 'center',
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            addUserOnMinister(ministerId, item.id)
                              .then(() => {
                                users.push(item)

                                this.setState({ users, usersFound: [], newUser: '' })
                              })
                          }}
                        >
                          <Icon
                            name="plus"
                            color={'#554A4C'}
                            size={25}
                            style={{
                              alignSelf: 'flex-end',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 80,
                        width: 5,
                        backgroundColor: item.color,
                        borderRadius: 5,
                      }}
                    />
                  </View>
                ))}
              </View>

              <Text style={[
                styles.caption,
                {
                  marginTop: 20,
                  marginRight: 50,
                  width: 'auto',
                  textAlign: 'right'
                }
              ]}>ministros vinculados</Text>

              {users.map(item => (
                <View
                  key={item.id}
                  style={styles.listContent}
                >
                  <View
                    style={{
                      marginHorizontal: 15,
                      flexDirection: 'row'
                    }}
                  >
                    <View
                      style={{
                        flex: 1
                      }}
                    >
                      <Text
                        style={{
                          color: '#554A4C',
                          fontSize: 16,
                          fontWeight: '700',
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          removeUserOnMinister(ministerId, item.id)
                            .then(() => {
                              const index = users.map(u => u.id).indexOf(item.id)
                              users.splice(index, 1)

                              this.setState({ users })
                            })
                        }}
                      >
                        <Icon
                          name="trash"
                          color={'#554A4C'}
                          size={25}
                          style={{
                            alignSelf: 'flex-end',
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 80,
                      width: 5,
                      backgroundColor: item.color,
                      borderRadius: 5,
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </>
    );
  }
}

