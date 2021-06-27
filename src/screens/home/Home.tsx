import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  Platform,
} from 'react-native';

import CalendarStrip from 'react-native-calendar-strip';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import * as lodash from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Task } from '../../components/Task';
import { styles } from './styles'
import { getLoggedUser, logoff } from '../../services/authentication';

export default class HomeScreen extends Component {
  state = {
    datesWhitelist: [
      {
        start: moment().subtract(365, 'days'),
        end: moment().add(365, 'days'), // total 4 days enabled
      },
    ],
    todoList: [],
    markedDate: [],
    currentDate: moment().format('YYYY-MM-DD'),
    isModalVisible: false,
    selectedTask: null,
    isDateTimePickerVisible: false,
    loggedUser: null,
    selectedDate: moment(),
    isLoading: true,
  };

  async componentDidMount() {
    const loggedUser = await getLoggedUser()
    this.setState({ loggedUser })

    const { currentDate } = this.state;
    this._getTasks(moment(currentDate));
  }

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
      let markDot = [];
      let collection;

      if (loggedUser.ministersLead && loggedUser.ministersLead.length > 0) {
        collection = firestore()
          .collection('tasks')
          .where('minister.id', 'in', loggedUser.ministersLead)
      } else {
        collection = firestore()
          .collection('tasks')
          .where('ministry.id', '==', loggedUser.id)
      }

      collection
        .onSnapshot(observer => {
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

          markDot = uniqDates
            .map(ud => ({
              date: ud,
              dots: tasks
                .filter(task => task.date == ud)
                .map(task => ({ key: task.id, color: task.minister.color, selectedDotColor: task.minister.color }))
            }))

          this.setState({
            markedDate: markDot,
            todoList: tasksByDate,
            isLoading: false,
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

  handleAlarmSet = () => {
    const { selectedTask } = this.state;
    const prevSelectedTask = { ...selectedTask };
    prevSelectedTask.alarm.isOn = !prevSelectedTask.alarm.isOn;
    this.setState({
      selectedTask: prevSelectedTask,
    });
  };

  logoff() {
    logoff()
  }

  render() {
    const {
      state: {
        datesWhitelist,
        markedDate,
        todoList,
        isModalVisible,
        selectedTask,
        isDateTimePickerVisible,
        currentDate,
        loggedUser,
        selectedDate,
        isLoading
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
        <View
          style={{
            flex: 1,
            paddingTop: 50,
            backgroundColor: '#32a19b'
          }}
        >
          {
            !isLoading &&
            <View
              style={{
                backgroundColor: '#fff',
                // paddingTop: 20,
              }}
            >
              <CalendarStrip
                // ref={ref => {
                //   this.calenderRef = ref;
                // }}
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                // daySelectionAnimation={{
                //   // type: 'background',
                //   duration: 200,
                //   highlightColor: '#ffffff',
                // }}
                style={{
                  height: 150,
                  // marginBottom: 10,
                  // borderBottomWidth: 3,
                  borderBottomEndRadius: 25,
                  borderBottomStartRadius: 25,
                  // borderColor: '#32a19b',
                  backgroundColor: '#32a19b'
                }}
                calendarHeaderStyle={{ color: '#fff' }}
                dateNumberStyle={{ color: '#fff', paddingTop: 10 }}
                dateNameStyle={{ color: '#fff' }}
                highlightDateNumberStyle={{
                  color: '#32a19b',
                  backgroundColor: '#fff',
                  marginTop: 10,
                  height: 35,
                  width: 35,
                  textAlign: 'center',
                  borderRadius: 17.5,
                  overflow: 'hidden',
                  paddingTop: 6,
                  fontWeight: '400',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                highlightDateNameStyle={{ color: '#fff' }}
                disabledDateNameStyle={{ color: 'grey' }}
                disabledDateNumberStyle={{ color: 'grey', paddingTop: 10 }}
                datesWhitelist={datesWhitelist}
                iconLeft={require('../../../assets/left-arrow.png')}
                iconRight={require('../../../assets/right-arrow.png')}
                iconContainer={{ flex: 0.1 }}
                markedDates={markedDate}
                selectedDate={selectedDate}
                onDateSelected={date => {
                  this._getTasks(date);
                  this.setState({
                    currentDate: this._formatDateToCompare(date),
                  });
                }}
              />
            </View>
          }
          {
            loggedUser?.ministersLead && loggedUser.ministersLead.length > 0 &&
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreateTask', {
                  updateCurrentTask: this._getTasks,
                  currentDate,
                  // createNewCalendar: this._createNewCalendar,
                })
              }
              style={styles.viewTask}
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
          }
          <View style={{ backgroundColor: '#fff', paddingTop: 20 }}>
            <TouchableOpacity
              style={{
                width: 'auto',
                height: 'auto',
                alignSelf: 'flex-end',
                borderRadius: 5,
                backgroundColor: '#32a19b',
                marginRight: 30,
                marginTop: -10
              }}
              onPress={() => this.logoff()}
            >
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  color: '#fff'
                }}
              >
                sair
                </Text>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: Dimensions.get('window').height - 170,
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: 20,
                }}
              >
                {todoList.map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('CreateTask', {
                        updateCurrentTask: this._getTasks,
                        currentDate,
                        // createNewCalendar: this._createNewCalendar,
                        itemSaved: {
                          ...item,
                          // ministerData: item.minister,
                        }
                      })
                    }}
                    key={item.id}
                    style={[styles.taskListContent, { borderRightColor: item.minister.color, borderRightWidth: 10 }]}
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
                            fontSize: 20,
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
                    {/* <View
                      style={{
                        height: 80,
                        width: 5,
                        backgroundColor: item.minister.color,
                        borderRadius: 5,
                      }}
                    /> */}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </>
    );
  }
}
