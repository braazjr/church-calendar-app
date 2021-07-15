import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  RefreshControl,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles'
import { getMinisters } from '../../services/minister';
import { getUsersFromMinister } from '../../services/user';
import LoadingComponent from '../../components/loading.component';
import { getLoggedUser } from '../../services/authentication';
import { mainStyles } from '../../../config/styles';

export default class MinisterListScreen extends Component {
  state = {
    isLoading: false,
    ministers: [],
    isAdmin: false,
    isRefreshing: false,
  };

  async componentDidMount() {
    this.setState({ isLoading: true })
    const loggedUser = await getLoggedUser()
    getMinisters()
      .onSnapshot(observer => {
        Promise.all(observer.docs
          .filter(doc => loggedUser.ministersLead.includes(doc.id))
          .map(async doc => {
            const users = await getUsersFromMinister(doc.id)
            return { id: doc.id, ...doc.data(), users }
          }))
          .then(data => {
            this.setState({
              isLoading: false,
              ministers: data,
              isAdmin: loggedUser.isAdmin,
              isRefreshing: false,
            })
          })
      });
  }

  render() {
    const {
      state: {
        isLoading,
        ministers,
        isAdmin,
        isRefreshing,
      },
      props: { navigation },
    } = this;

    return (
      <>
        <LoadingComponent
          isLoading={isLoading}
        >
          <View
            style={{
              flex: 1,
              // marginTop: hasNotch() ? 50 : 20,
              marginTop: 50,
              backgroundColor: '#fff'
            }}
          >
            {
              isAdmin &&
              (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('MinisterRegister', {
                    })
                  }}
                  style={styles.view}
                >
                  <Icon
                    name="plus"
                    color={'#fff'}
                    size={30}
                    style={{
                      paddingLeft: 2,
                      paddingTop: 2,
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              )
            }
            <View
              style={{
                width: '100%',
                height: Dimensions.get('window').height,
                marginTop: 10,
              }}
            >
              <Text style={styles.newMinister}>ministérios</Text>
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: '30%',
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => {
                      this.componentDidMount()
                    }}
                  />
                }
              >
                {ministers.map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('MinisterRegister', {
                        itemSaved: {
                          ...item,
                        }
                      })
                    }}
                    key={item.id}
                    style={[
                      mainStyles.cardList,
                      {
                        height: 80,
                        borderRightColor: item.color,
                        borderRightWidth: 10
                      }
                    ]}
                  >
                    <View
                      style={{
                        marginLeft: 13,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: '700',
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            marginLeft: 10,
                            marginTop: 10
                          }}
                        >
                          {(item.users || []).length} ministros
                            </Text>
                      </View>
                    </View>
                    {/* <View
                    style={{
                      height: 70,
                      width: 5,
                      backgroundColor: item.color,
                      borderRadius: 5,
                    }}
                  /> */}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </LoadingComponent>
      </>
    );
  }
}
