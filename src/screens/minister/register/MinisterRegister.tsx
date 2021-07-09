import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  TextInput,
  Platform,
} from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import { deleteMinister, updateMinister } from '../../../services/minister';
import { styles } from './styles';
import { hasNotch } from '../../../utils/device.util';

const { width: vw } = Dimensions.get('window');


export default class MinisterRegister extends Component {
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
    itemSaved: {
      id: undefined
    },

    ministerId: undefined,
    color: '',
    name: '',

    availableFunctions: [],
    ministers: [],
    users: [],
    newFunction: undefined,

    actionSheetMinisterOptions: [],
    actionSheetMinistryOptions: [],
  };

  async componentDidMount() {
    const {
      id: ministerId,
      color,
      name,
      functions,
    } = this.props['route'].params.itemSaved || {}

    if (this.props['route'].params.itemSaved) {
      this.setState({
        ministerId,
        itemSaved: this.props['route'].params.itemSaved,
        color,
        name,
        functions,
      })
    } else {
      this.setState({ color: this.generateNewColor() })
    }
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

  async _handleCreateministerData() {
    const {
      state: {
        ministerId,
        color,
        name,
        functions,
      },
    } = this;

    const ministerData = {
      id: ministerId,
      color,
      name,
      functions,
    };

    const id = await updateMinister(ministerData);
    this.setState({ ministerId: id })
    return true;
  };

  generateNewColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }

  render() {
    const {
      state: {
        visibleHeight,

        ministerId,
        color,
        name,
        functions,
        newFunction,
        itemSaved,
      },
      props: { navigation }
    } = this;

    return (
      <>
        <View style={styles.container}>
          <View
            style={{
              height: visibleHeight,
              paddingTop: Platform.OS == 'android' ? 60 : hasNotch() ? 50 : 15,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingBottom: '30%',
              }}
            >

              <View
                style={{ flexDirection: 'row' }}
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
                <Text style={styles.caption}>{ministerId ? 'edite o' : 'novo'} ministério</Text>
              </View>

              <View style={styles.formContainer}>

                <View>
                  {
                    itemSaved.id && (
                      <Text
                        style={{
                          color: '#9CAAC4',
                          fontSize: 14,
                          fontWeight: '600',
                          paddingBottom: 5,
                        }}
                      >nome</Text>
                    )
                  }
                  <TextInput
                    style={styles.title}
                    onChange={text => this.setState({ name: text.nativeEvent.text })}
                    value={name}
                    placeholder="nome"
                  />
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
                    cor
                      </Text>
                  <View
                    style={{
                      ...styles.title,
                      borderLeftWidth: 0,
                      marginTop: 10,
                      marginBottom: 0,
                      flexDirection: 'row'
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        backgroundColor: color,
                        height: 30,
                        borderRadius: 20,
                        alignSelf: 'flex-end',
                        flex: 1,
                        borderTopEndRadius: 20,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        const color = this.generateNewColor()
                        this.setState({ color })
                      }}
                    >
                      <Icon
                        name="refresh"
                        color={'#4EC5F1'}
                        size={20}
                        style={{
                          flex: 1,
                          marginLeft: 15
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.seperator} />
                </View>


                <View>
                  {
                    itemSaved.id && (
                      <Text
                        style={{
                          color: '#9CAAC4',
                          fontSize: 14,
                          fontWeight: '600',
                          paddingBottom: 5,
                        }}
                      >
                        funções
                      </Text>
                    )
                  }
                  <TextInput
                    style={styles.title}
                    onChange={text => this.setState({ newFunction: text.nativeEvent.text })}
                    onSubmitEditing={() => {
                      if (functions.indexOf(newFunction) >= 0) {
                        Alert.alert('function has exists')
                      } else {
                        functions.push(newFunction)
                        this.setState({ newFunction: '' })
                      }
                    }}
                    value={newFunction}
                    placeholder="insira a nova função"
                  />
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
                    {
                      functions.map((func, index) => (
                        <View
                          style={styles.badge}
                          key={index}
                        >
                          <View
                            style={{ flexDirection: 'row' }}
                          >
                            <Text style={{ fontSize: 14 }}>
                              {func}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                const index = functions.indexOf(func)
                                functions.splice(index, 1)

                                this.setState({
                                  functions
                                })
                              }}
                            >
                              <Icon
                                name="trash"
                                color={'black'}
                                size={15}
                                style={{
                                  paddingTop: 1.5,
                                  marginLeft: 15
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    }
                  </View>
                  <View style={styles.seperator} />
                </View>

              </View>



              <TouchableOpacity
                style={[
                  styles.createButton,
                  {
                    backgroundColor: 'rgba(230, 166, 45, 0.5)',
                  }
                ]}
                onPress={() => {
                  navigation.navigate('ManageUsers', {
                    ministerId: ministerId,
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: '#fff',
                  }}
                >
                  gerencie ministros
                  </Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={[
                  styles.createButton,
                  {
                    backgroundColor:
                      name === ''
                        ? '#31a09a3d'
                        : '#32a19b',
                    marginTop: 10,
                  },
                ]}
                onPress={async () => {
                  this._handleCreateministerData()
                    .then(() => {
                      navigation.navigate('Home')
                    })
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: '#fff',
                  }}
                >
                  {ministerId ? 'salve' : 'add'} seu ministério
                    </Text>
              </TouchableOpacity>


              {ministerId &&
                <TouchableOpacity
                  style={[
                    styles.createButton,
                    {
                      backgroundColor: 'rgba(230, 45, 57, 0.5)',
                      marginTop: 10,
                    },
                  ]}
                  onPress={async () => {
                    Alert
                      .alert(
                        'exclusão de ministério',
                        'você quer deletar esse ministério?',
                        [
                          {
                            text: 'sim',
                            style: 'destructive',
                            onPress: () => {
                              deleteMinister(ministerId)
                                .then(() => {
                                  this.props[navigation].navigate('Home')
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
                    deletar ministério
                        </Text>
                </TouchableOpacity>
              }
            </ScrollView>
          </View>
        </View>
      </>
    );
  }
}

