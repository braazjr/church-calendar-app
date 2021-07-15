import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles';
import { addUserOnMinister, removeUserOnMinister } from '../../../services/minister';
import { getUsers, getUsersFromMinister } from '../../../services/user';
import LoadingComponent from '../../../components/loading.component';
import { User } from '../../../models/user.model';

const { width: vw } = Dimensions.get('window');


export default class ManagerUsers extends Component {
  state = {
    isLoading: false,
    keyboardHeight: 0,
    visibleHeight: Dimensions.get('window').height,

    users: [],
    avaiableUsers: [],
    usersFound: [],
    ministerId: '',
    newUser: '',
  };

  async componentDidMount() {
    const {
    } = this;

    const {
      ministerId,
    } = this.props['route'].params || {}

    const users: User[] = await getUsersFromMinister(ministerId)
    console.log('users', users.map(u => u.name))
    let avaiableUsers: User[] = await getUsers()
    avaiableUsers = avaiableUsers.filter(user => !users.map(u => u.id).includes(user.id) && user.name != null && user.name != 'null')
    console.log('avaiableUsers', avaiableUsers.map(au => au.name))

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
        isLoading,
        visibleHeight,

        ministerId,
        newUser,
        users,
        avaiableUsers,
        usersFound,
      },
      props: { navigation }
    } = this;

    return (
      <>
        <LoadingComponent
          isLoading={isLoading}
        >
          <View style={styles.container}>
            <View
              style={{
                height: visibleHeight,
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: '30%',
                }}
              >
                <View
                  style={{ flexDirection: 'row', marginTop: 60 }}
                >
                  <View style={styles.backButton}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ministérios')}
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
                  {
                    avaiableUsers.length > 0 &&
                    (
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
                                  .filter(au => {
                                    return au.name.toLowerCase().includes(text.nativeEvent.text.toLowerCase())
                                      || au.email.toLowerCase().includes(text.nativeEvent.text.toLowerCase())
                                  })
                              })
                            }
                          }}
                          value={newUser}
                          placeholder="pesquise novo ministro"
                        />
                      </View>
                    )
                  }

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
                            flex: 3
                          }}
                        >
                          <Text
                            style={{
                              color: '#554A4C',
                              fontSize: 16,
                              fontWeight: '700',
                            }}
                          >
                            {item.name || 'Sem nome'}
                          </Text>
                          <Text
                            style={{
                              color: '#554A4C',
                              fontSize: 12,
                              fontWeight: '500',
                            }}
                          >
                            {'\n'}
                            {item.email}
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
        </LoadingComponent>
      </>
    );
  }
}

