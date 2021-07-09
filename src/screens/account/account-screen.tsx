import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';

import { hasNotch } from '../../utils/device.util';
import { getLoggedUser } from '../../services/authentication';
import { User } from '../../models/user-model';
import { mainStyle } from '../../../config/styles';
import { updateUser } from '../../services/user';
import { getMinisters } from '../../services/minister';

const toastConfig = {
  success: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: mainStyle.primaryColor }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
      }}
      text1={text1}
      text2={text2}
    />
  ),
};

export default class AccountScreen extends Component {
  state = {
    user: new User(),
    name: undefined,
    editingName: false,
    ministers: [],
    ministersLead: [],
  };

  async componentDidMount() {
    let user = await getLoggedUser()
    user.photoUrl = user.photoUrl.replace('s96-c', 's400-c')

    this.getMinisters(user.ministers, user.ministersLead)

    this.setState({ user, name: user.name })
  }

  updateUserName(name) {
    let { user } = this.state
    updateUser(user.id, { name })
      .then(() => Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'sucesso',
        text2: 'seu nome foi atualizado!',
      }))
      .catch(() => Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'erro',
        text2: 'ocorreu um erro ao atualizar seu nome!'
      }))
      .finally(() => {
        user.name = name
        this.setState({ user, name })
      })
  }

  getMinisters(ministers, ministersLead) {
    getMinisters()
      .onSnapshot(data => {
        const ms = data.docChanges()
          .filter(doc => ministers.includes(doc.doc.id))
        console.log(ms)

        const msl = data.docChanges()
          .filter(doc => ministersLead.includes(doc.doc.id))
        console.log(msl)

        this.setState({
          ministers: ms.map(doc => doc.doc.data()),
          ministersLead: msl.map(doc => doc.doc.data()),
        })
      })
  }

  render() {
    const {
      state: {
        user,
        name,
        editingName,
        ministers,
        ministersLead,
      },
    } = this;

    return (
      <>
        <Toast
          ref={(ref) => Toast.setRef(ref)}
          style={{
            zIndex: 999,
            borderLeftColor: mainStyle.primaryColor,
          }}
          config={toastConfig}
        />
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
            {/* <Text style={styles.title}>
              conta
            </Text> */}
            <ScrollView>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={{ uri: user.photoUrl }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    marginTop: '5%',
                  }}
                />
              </View>

              <View
                style={{
                  marginTop: '10%',
                  marginHorizontal: '8%',
                }}
              >
                <View>
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    nome
                  </Text>

                  <View
                    style={{
                      height: 25,
                      marginTop: 3,
                      flexDirection: 'row'
                    }}
                  >
                    {
                      editingName ?
                        (
                          <TextInput
                            style={{
                              fontSize: 19,
                              flex: 4,
                            }}
                            onChange={text => this.setState({ name: text.nativeEvent.text })}
                            value={name}
                            placeholder="pesquise novo ministro"
                          />
                        )
                        :
                        (
                          <Text style={{
                            fontSize: 19,
                            flex: 4,
                          }}>
                            {user.name}
                          </Text>
                        )
                    }
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                      }}
                      onPress={() => {
                        if (editingName) {
                          this.updateUserName(name)
                        }
                        this.setState({ editingName: !editingName })
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        marginRight: '5%',
                        color: mainStyle.primaryColor
                      }}>
                        {editingName ? 'salvar' : 'editar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{
                  height: 0.5,
                  width: '100%',
                  backgroundColor: '#979797',
                  alignSelf: 'center',
                  marginTop: 10,
                  marginBottom: 30,
                }} />
                <View>
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    email
                  </Text>
                  <View
                    style={{
                      height: 25,
                      marginTop: 3,
                    }}
                  >
                    <Text style={{ fontSize: 19 }}>
                      {user.email}
                    </Text>
                  </View>
                </View>
                <View style={{
                  height: 0.5,
                  width: '100%',
                  backgroundColor: '#979797',
                  alignSelf: 'center',
                  marginVertical: 10,
                }} />

                <View
                  style={{ marginTop: 25 }}
                >
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    ministérios que estou
                  </Text>
                  <View
                    style={{
                      height: 25,
                      marginTop: 3,
                    }}
                  >
                    {
                      ministers.map(minister => (
                        <Text style={{ fontSize: 14 }}>
                          <Icon
                            name={'check'}
                            color={'#9CAAC4'}
                            size={20}
                          /> {minister.name}
                        </Text>
                      ))
                    }
                  </View>
                </View>

                <View
                  style={{ marginTop: 25 }}
                >
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 14,
                      fontWeight: '600',
                      marginTop: 35,
                    }}
                  >
                    lider em
                  </Text>
                  <View
                    style={{
                      height: 25,
                      marginTop: 3,
                    }}
                  >
                    {
                      ministersLead.map(minister => (
                        <Text style={{ fontSize: 14 }}>
                          <Icon
                            name={'check'}
                            color={'#9CAAC4'}
                            size={20}
                          /> {minister.name}
                        </Text>
                      ))
                    }
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </>
    );
  }
}
