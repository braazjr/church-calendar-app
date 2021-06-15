import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles'
import { getMinisters } from '../../services/minister';
import { getUsersFromMinister } from '../../services/user';

export default class MinisterListScreen extends Component {
  state = {
    ministers: []
  };

  componentDidMount() {
    getMinisters()
      .onSnapshot(observer => {
        Promise.all(observer.docs
          .map(async doc => {
            const users = await getUsersFromMinister(doc.id)
            return { id: doc.id, ...doc.data(), users }
          }))
          .then(data => {
            this.setState({
              ministers: data
            })
          })
      });
  }

  render() {
    const {
      state: {
        ministers
      },
      // props: { navigation },
    } = this;

    return (
      <>
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'ios' ? 50 : 15,
            backgroundColor: '#fff'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props['navigation'].navigate('MinisterRegister', {
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
                // paddingBottom: 20,
              }}
            >
              {ministers.map(item => (
                <TouchableOpacity
                  onPress={() => {
                    this.props['navigation'].navigate('MinisterRegister', {
                      itemSaved: {
                        ...item,
                      }
                    })
                  }}
                  key={item.id}
                  style={[styles.listContent, { borderRightColor: item.color, borderRightWidth: 10 }]}
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
      </>
    );
  }
}
