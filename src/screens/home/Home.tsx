import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  RefreshControl,
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import * as lodash from 'lodash';
import { CalendarList, MultiDotMarking } from 'react-native-calendars';
import database from '@react-native-firebase/database';

import { Task } from '../../components/Task';
import { styles } from './styles'
import { checkFCMPermissions, getLoggedUser } from '../../services/authentication';
import LoadingComponent from '../../components/loading.component';
import { mainStyleColors, mainStyles } from '../../../config/styles';

export default class HomeScreen extends Component {
  state = {
    visibleHeight: Dimensions.get('window').height,
    datesWhitelist: [
      {
        start: moment().subtract(365, 'days'),
        end: moment().add(365, 'days'), // total 4 days enabled
      },
    ],
    todoList: [],
    markedDates: {},
    currentDate: moment().format('YYYY-MM-DD'),
    isModalVisible: false,
    selectedTask: null,
    isDateTimePickerVisible: false,
    loggedUser: null,
    selectedDate: moment(),
    isLoading: false,
    slackMessage: undefined,
    isRefreshing: false,
  };

  async componentDidMount() {
    this.setState({ isLoading: true })

    const slackMessages = await (await database().ref('/configs/slackMessages').once('value')).toJSON()

    const slackMessage = await this.getSlackMessage(slackMessages as string[]);

    const loggedUser = await getLoggedUser()
    this.setState({ loggedUser, slackMessage })

    const { currentDate } = this.state;
    this._getTasks(moment(currentDate));

    checkFCMPermissions()
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

  _handleModalVisible = () => {
    const { isModalVisible } = this.state;
    this.setState({
      isModalVisible: !isModalVisible,
    });
  };

  _formatDateToCompare = date => {
    return `${moment(date).format('YYYY')}-${moment(date).format('MM')}-${moment(date).format('DD')}`
  }

  _getTasks = async (currentDate: moment.Moment) => {
    const { loggedUser } = this.state

    try {
      let markDot = {};
      let collection = firestore()
        .collection('tasks') as any;

      if (loggedUser.id && loggedUser.ministersLead && loggedUser.ministersLead.length > 0) {
        collection = collection
          .where('minister.id', 'in', loggedUser.ministersLead)
      } else if (loggedUser.id) {
        collection = collection
          .where('ministry.id', '==', loggedUser.id)
      }

      collection
        .onSnapshot(async observer => {
          let tasks = observer.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .map(doc => {
              doc.date = moment(doc.date._seconds * 1000)
              return doc
            })

          const tasksByDate = tasks
            .filter(task => this._formatDateToCompare(task.date) == this._formatDateToCompare(currentDate))

          const dates = tasks
            .map(task => task.date)
          const uniqDates = lodash.uniq(dates)

          markDot[`${currentDate.format('yyyy-MM-DD')}`] = {
            selected: true
          }
          for await (const date of uniqDates) {
            markDot[`${moment(date).format('yyyy-MM-DD')}`] = {
              dots: tasks
                .filter(task => task.date == date)
                .map(task => ({
                  key: task.id,
                  color: task.minister.color,
                })),
              selected: this._formatDateToCompare(date) == currentDate.format('YYYY-MM-DD')
            } as MultiDotMarking
          }

          this.setState({
            markedDates: markDot,
            todoList: tasksByDate,
            isLoading: false,
            isRefreshing: false,
          });
        }, error => {
          console.error(error)
        })
    } catch (error) {
      // Error retrieving data
      console.error('\nGET_TASKS\n', error)
    }
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    const { selectedTask } = this.state;
    const prevSelectedTask = { ...selectedTask };
    const selectedDatePicked = prevSelectedTask.alarm.time;
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const newModifiedDay = moment(selectedDatePicked)
      .hour(hour)
      .minute(minute);

    prevSelectedTask.alarm.time = newModifiedDay;
    this.setState({
      selectedTask: prevSelectedTask,
    });

    this._hideDateTimePicker();
  };

  hasTodayTask() {
    const { loggedUser, todoList } = this.state
    return todoList.filter(task => task.ministry.id == loggedUser.id).length > 0
  }

  async getSlackMessage(slackMessages: string[]) {
    const slackMessagesIndex = Math.random().toPrecision(1).split('.')[1];
    const slackMessage = slackMessages[slackMessagesIndex];

    if (!slackMessage) await this.getSlackMessage(slackMessages)

    return slackMessage;
  }

  render() {
    const {
      state: {
        markedDates,
        todoList,
        isModalVisible,
        selectedTask,
        isDateTimePickerVisible,
        currentDate,
        loggedUser,
        selectedDate,
        isLoading,
        slackMessage,
        isRefreshing,
      },
      props: {
        navigation
      }
    } = this;

    return (
      <>
        {selectedTask !== null && (
          <Task isModalVisible={isModalVisible}>
            <DateTimePicker
              isVisible={isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              mode="time"
            />
          </Task>
        )}

        <LoadingComponent
          isLoading={isLoading}
        >
          <View
            style={{
              // marginTop: hasNotch() ? 50 : 20,
              marginTop: 50,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 100,
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
              <View style={{
                width: 350,
                alignSelf: 'center',
                borderBottomWidth: 2,
                borderBottomColor: mainStyleColors.primaryColor,
              }}>
                <CalendarList
                  style={{
                    width: 350,
                  }}
                  current={moment(selectedDate).format('yy-MM-DD')}
                  horizontal
                  pastScrollRange={0}
                  pagingEnabled
                  calendarWidth={350}
                  onDayPress={day => {
                    this._getTasks(moment(day.dateString));
                    this.setState({
                      currentDate: this._formatDateToCompare(day),
                    });
                  }}
                  monthFormat="yyyy MMMM"
                  hideArrows
                  theme={{
                    selectedDayBackgroundColor: mainStyleColors.primaryColor,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: mainStyleColors.primaryColor,
                    calendarBackground: 'transparent',
                    textDisabledColor: '#d9dbe0',
                  }}
                  markingType={'multi-dot'}
                  markedDates={markedDates as any}
                />
              </View>
              <View>
                <View style={{ backgroundColor: '#fff', paddingTop: 20 }}>
                  {
                    loggedUser && loggedUser.id && loggedUser.isLeader &&
                    (
                      <TouchableOpacity
                        style={[
                          styles.createTaskButton
                        ]}
                        onPress={async () => {
                          navigation.navigate('CreateTask', {
                            updateCurrentTask: this._getTasks,
                            // currentDate,
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
                          add uma escala
                      </Text>
                      </TouchableOpacity>
                    )
                  }
                  <View
                    style={{
                      width: '100%',
                    }}
                  >
                    {/* <ScrollView
                      contentContainerStyle={{
                        paddingBottom: 20,
                      }}
                    > */}
                    {
                      loggedUser?.ministers?.length == 0 &&
                      (
                        <View
                          style={[
                            mainStyles.cardList,
                            {
                              alignContent: 'center',
                              flexDirection: 'column',
                              padding: 20,
                              backgroundColor: 'rgba(230, 166, 45, 0.5)',
                              height: 'auto',
                            }]}
                        >
                          <Text
                            style={{
                              flex: 1,
                              color: 'black',
                              fontSize: 18,
                              fontWeight: '700',
                            }}
                          >
                            sem ministérios
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignContent: 'center',
                              paddingTop: 20,
                            }}
                          >
                            <Text
                              style={{
                                flex: 1,
                                color: 'black',
                                fontSize: 14,
                                flexWrap: 'wrap',
                                textAlign: 'center',
                              }}
                            >
                              você ainda não foi convidado(a) a nenhum ministério.
                            {'\n'}
                            entre em contato com sua liderança!
                            </Text>
                          </View>
                        </View>
                      )
                    }
                    {
                      loggedUser?.ministers?.length > 0 && (todoList.length == 0 || !this.hasTodayTask()) &&
                      (
                        <View
                          style={[
                            mainStyles.cardList,
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
                            }}
                          >
                            sem escalas nessa data!
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              color: 'black',
                              fontSize: 14,
                            }}
                          >
                            {/* nesse dia você está de folga :) */}
                            {`${slackMessage || 'esse dia você está de folga'} :)`}
                          </Text>
                        </View>
                      )
                    }
                    {todoList.map(item => (
                      <TouchableOpacity
                        onPress={() => {
                          let destinationPage = loggedUser?.ministersLead && loggedUser.ministersLead.length > 0 ? 'CreateTask' : 'ViewTask'
                          navigation.navigate(destinationPage, {
                            updateCurrentTask: this._getTasks,
                            currentDate,
                            itemSaved: {
                              ...item,
                            }
                          })
                        }}
                        key={item.id}
                        style={[
                          mainStyles.cardList,
                          {
                            borderRightColor: item.minister.color,
                            borderRightWidth: 10
                          }]
                        }
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
                            <View
                              style={{
                                height: 12,
                                width: 12,
                                borderRadius: 6,
                                backgroundColor: item.minister.color,
                                marginRight: 8,
                              }}
                            />
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 18,
                                fontWeight: '700',
                              }}
                            >
                              {item.minister.name} - {moment(item.date).format('HH:mm')}
                            </Text>
                          </View>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginLeft: 10,
                                marginTop: 10
                              }}
                            >
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 14,
                                }}
                              >
                                {item.ministry.name} / {item.functions.join(' & ')}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {/* </ScrollView> */}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </LoadingComponent>
      </>
    );
  }
}

