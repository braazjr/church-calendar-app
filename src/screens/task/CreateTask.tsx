import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';

import { CalendarList } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles';
import { getMinisters } from '../../services/minister';
import { getLoggedUser } from '../../services/authentication';
import { getUsersFromMinister } from '../../services/user';
import { deleteTask, updateTask } from '../../services/task';
import { createChangeRequest } from '../../services/change-requests.service';
import { Task } from '../../models/task-model';
import { hasNotch } from '../../utils/device.util';
import { Minister } from '../../models/minister.model';
import { mainStyleColors, mainStyles } from '../../../config/styles';

const { width: vw } = Dimensions.get('window');
// moment().format('YYYY/MM/DD')


export default class CreateTask extends Component {
  state = {
    selectedDate: moment(),
    currentDay: moment().format(),
    keyboardHeight: 0,
    visibleHeight: Dimensions.get('window').height,
    isDateTimePickerVisible: false,
    itemSaved: new Task(),

    functions: [],
    availableFunctions: [],
    ministers: [],
    users: [],

    loggedUser: null,
    isMinisterLead: false,

    taskId: '',
    minister: undefined,
    ministry: undefined,

    actionSheetMinisterOptions: [],
    actionSheetMinistryOptions: [],
  };

  async componentDidMount() {
    LocaleConfig.locales['pt-br'] = {
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      today: 'Hoje'
    };
    LocaleConfig.defaultLocale = 'pt-br';

    const loggedUser = await getLoggedUser()
    this.setState({ loggedUser })

    const {
      id: taskId,
      date,
      minister,
      ministry,
      functions,
    } = this.props['route'].params.itemSaved || {}

    await this._getMinisters(taskId ? minister : undefined, loggedUser.ministersLead);

    if (this.props['route'].params.itemSaved) {
      this.setState({
        taskId,
        itemSaved: this.props['route'].params.itemSaved,
        selectedDate: date || this.props['route'].params.currentDate,
        minister,
        ministry,
        functions,
        isMinisterLead: (loggedUser.ministersLead || []).includes(minister.id)
      })
    }
  }

  async _getMinisters(minister = undefined, ministersLead = []) {
    getMinisters()
      .onSnapshot(observer => {
        let ministers: Minister[] = observer.docs
          .filter(doc => ministersLead.includes(doc.id))
          .map(doc => ({ id: doc.id, ...doc.data() }) as Minister)

        let ministerOptions = ministers.map(m => m.name);
        ministerOptions.push('cancel');

        if (minister) {
          const ministerSelected = ministers.find(m => m.id == minister.id)

          this.setState({
            ministers,
            actionSheetMinisterOptions: ministerOptions,
            availableFunctions: ministerSelected.functions
          });

          this._getUsersFromMinister(ministerSelected)
        } else {
          this.setState({
            ministers,
            actionSheetMinisterOptions: ministerOptions
          });
        }

        return {
          ministers,
          ministerOptions
        }
      });
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

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  async _handleCreateTaskData() {
    const {
      state: {
        taskId,
        minister,
        ministry,
        functions,
        selectedDate,
      },
    } = this;

    const taskData = {
      id: taskId,
      date: moment(selectedDate).toDate(),
      minister: {
        id: minister.id,
        color: minister.color,
        name: minister.name
      },
      ministry: {
        id: ministry.id,
        name: ministry.name
      },
      functions,
    };

    await updateTask(taskData);
    return true
  };

  _handleDatePicked = (selectedTime, selectedDate) => {
    const hour = moment(selectedTime).hour();
    const minute = moment(selectedTime).minute();
    const newModifiedDay = moment(selectedDate)
      .hour(hour)
      .minute(minute);

    this.setState({
      selectedDate: newModifiedDay,
    });

    this._hideDateTimePicker();
  };

  _handleActionSheetSelected = (type, list, listOptions, index) => {
    if (index < listOptions.length - 1) {
      const selected = list[index]

      switch (type) {
        case 'MINISTER':

          this._getUsersFromMinister(selected);
          break;

        case 'USER':
          this.setState({
            ministry: selected,
          })
          break;

        default:
          break;
      }
    }
  }

  _getUsersFromMinister(selected) {
    getUsersFromMinister(selected.id)
      .then(users => {
        let userOptions = users.map(u => u.name);
        userOptions.push('cancel');

        this.setState({
          minister: selected,
          availableFunctions: selected.functions,
          users,
          actionSheetMinistryOptions: userOptions
        });
      })
  }

  async _deleteTask(taskId) {
    return deleteTask(taskId)
  }

  async _changeRequest() {
    const { taskId } = this.state

    return createChangeRequest(taskId)
  }

  render() {
    const {
      state: {
        visibleHeight,
        isDateTimePickerVisible,

        taskId,
        minister,
        ministry,
        availableFunctions,
        functions,
        selectedDate,
        itemSaved,

        ministers,
        users,

        actionSheetMinisterOptions,
        actionSheetMinistryOptions,

        isMinisterLead
      },
      props: {
        navigation
      },

    } = this;

    const isEdit = (selectedDate != undefined && ministry != undefined && minister != undefined)

    return (
      <>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={selectedTime => this._handleDatePicked(selectedTime, selectedDate)}
          onCancel={this._hideDateTimePicker}
          mode="time"
        />

        <ActionSheet
          ref={o => this.ActionSheetMinister = o}
          title={'selecione um ministério?'}
          options={actionSheetMinisterOptions}
          cancelButtonIndex={actionSheetMinisterOptions.length - 1}
          destructiveButtonIndex={actionSheetMinisterOptions.length - 1}
          onPress={async index => {
            await this._handleActionSheetSelected(
              'MINISTER',
              ministers,
              actionSheetMinisterOptions,
              index
            )
          }}
        />

        <ActionSheet
          ref={o => this.ActionSheetMinistry = o}
          title={'selecione um ministro?'}
          options={actionSheetMinistryOptions}
          cancelButtonIndex={actionSheetMinistryOptions.length - 1}
          destructiveButtonIndex={actionSheetMinistryOptions.length - 1}
          onPress={async index => {
            await this._handleActionSheetSelected(
              'USER',
              users,
              actionSheetMinistryOptions,
              index
            )
          }}
        />

        <View style={styles.container}>
          <View
            style={{
              height: Platform.OS == 'android' ? '100%' : visibleHeight,
              // paddingTop: Platform.OS == 'android' ? 76 : hasNotch() ? 80 : 50,
              paddingTop: Platform.OS == 'android' || hasNotch() ? 80 : 50,
            }}
          >
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
                <Text style={styles.newTask}>{taskId ? (isMinisterLead ? 'edite a' : 'sua') : 'nova'} escala</Text>
              </View>
              {
                (!taskId || isMinisterLead) &&
                (<View style={styles.calenderContainer}>
                  <CalendarList
                    style={{
                      width: 350,
                      height: 350,
                    }}
                    current={moment(selectedDate).format('yy-MM-DD')}
                    minDate={moment().format()}
                    horizontal
                    pastScrollRange={0}
                    pagingEnabled
                    calendarWidth={350}
                    onDayPress={day => {
                      this.setState({
                        selectedDate: moment(day.dateString),
                        currentDay: day.dateString,
                        // alarmTime: day.dateString,
                      });
                    }}
                    monthFormat="yyyy MMMM"
                    hideArrows
                    // markingType="simple"
                    theme={{
                      selectedDayBackgroundColor: mainStyleColors.primaryColor,
                      selectedDayTextColor: '#ffffff',
                      todayTextColor: mainStyleColors.primaryColor,
                      calendarBackground: 'transparent',
                      textDisabledColor: '#d9dbe0',
                    }}
                    markedDates={{
                      [moment(selectedDate).format('yy-MM-DD')]: {
                        selected: true,
                        selectedColor: mainStyleColors.primaryColor,
                      },
                    }}
                  />
                </View>)
              }
              <View style={mainStyles.cardContainer}>
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
                  <TouchableOpacity
                    onPress={() => (!taskId || isMinisterLead) && this._showDateTimePicker()}
                    style={{
                      height: 25,
                      marginTop: 3,
                    }}
                  >
                    <Text style={{ fontSize: 19 }}>
                      {moment(itemSaved.date || selectedDate).format('h:mm A')}
                    </Text>
                  </TouchableOpacity>
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
                  <TouchableOpacity
                    style={{
                      ...styles.title,
                      borderLeftWidth: 3,
                      borderColor: (minister || {}).color,
                      marginTop: 10,
                      marginBottom: 0,
                    }}
                    onPress={() => {
                      (!taskId || isMinisterLead) && this.ActionSheetMinister.show()
                    }}
                  >
                    <Text style={{
                      fontSize: 19,
                    }}>
                      {(minister || {}).name}
                    </Text>
                  </TouchableOpacity>
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
                  <TouchableOpacity
                    style={{
                      ...styles.title,
                      borderLeftWidth: 0,
                      marginTop: 10,
                      marginBottom: 0,
                    }}
                    onPress={() => {
                      (!taskId || isMinisterLead) && minister && this.ActionSheetMinistry.show()
                    }}
                  >
                    <Text style={{
                      fontSize: 19,
                    }}>
                      {(ministry || {}).name}
                    </Text>
                  </TouchableOpacity>
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
                                <TouchableOpacity
                                  onPress={() => {
                                    if ((!taskId || isMinisterLead)) {
                                      const index = functions.indexOf(func.name)
                                      if (index >= 0) {
                                        functions.splice(index, 1)
                                      } else {
                                        functions.push(func.name)
                                      }

                                      this.setState({
                                        functions
                                      })
                                    }
                                  }}>
                                  <Text style={{ textAlign: 'center', fontSize: 14 }}>
                                    {func.name}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ))
                        }
                      </View>
                    </View>
                  )
                }
              </View>
              {
                (!taskId || isMinisterLead) &&
                (<TouchableOpacity
                  style={[
                    mainStyles.button,
                    {
                      backgroundColor:
                        isEdit
                          ? mainStyleColors.primaryColor
                          : '#31a09a3d',
                    },
                  ]}
                  onPress={async () => {
                    this._handleCreateTaskData()
                      .then(() => navigation.navigate('Home'))
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: '#fff',
                    }}
                  >
                    {taskId ? 'salve' : 'add'} sua escala
                      </Text>
                </TouchableOpacity>)
              }
              {isMinisterLead && taskId &&
                <TouchableOpacity
                  style={[
                    mainStyles.button,
                    {
                      backgroundColor:
                        isEdit
                          ? '#e62d2d'
                          : 'rgba(230, 45, 57, 0.5)',
                      marginTop: 10,
                    },
                  ]}
                  onPress={async () => {
                    Alert
                      .alert(
                        'exclusão de escala',
                        'você quer excluir a escala?',
                        [
                          {
                            text: 'sim',
                            style: 'destructive',
                            onPress: () => {
                              this._deleteTask(taskId)
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
                    excluir escala
                        </Text>
                </TouchableOpacity>
              }
              {
                moment().isBefore(selectedDate) && !itemSaved.hasOpenChangeRequest && (!!taskId) &&
                (
                  <TouchableOpacity
                    style={[
                      mainStyles.button,
                      {
                        backgroundColor:
                          isEdit
                            ? '#a09c31'
                            : '#a09e313d',
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
        </View>
      </>
    );
  }
}

