/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

import Login from './src/screens/login/Login';
import { mainStyle } from './config/styles';
import { checkUserFromFirestore, isLeader } from './src/services/authentication';
import CreateTask from './src/screens/task/CreateTask';
import MinisterListScreen from './src/screens/minister/MinisterList';
import HomeScreen from './src/screens/home/Home';
import MinisterRegister from './src/screens/minister/register/MinisterRegister';
import ManagerUsers from './src/screens/minister/register/ManageUsers';
import ChangeRequestsScreen from './src/screens/change-requests/change-requests-screen';
import { LocaleConfig } from 'react-native-calendars';
import ViewTaskScreen from './src/screens/task/ViewTask.screen';
import { Image } from 'react-native';

//  const Section: React.FC<{
//    title: string;
//  }> = ({children, title}) => {
//    const isDarkMode = useColorScheme() === 'dark';
//    return (
//      <View style={styles.sectionContainer}>
//        <Text
//          style={[
//            styles.sectionTitle,
//            {
//              color: isDarkMode ? Colors.white : Colors.black,
//            },
//          ]}>
//          {title}
//        </Text>
//        <Text
//          style={[
//            styles.sectionDescription,
//            {
//              color: isDarkMode ? Colors.light : Colors.dark,
//            },
//          ]}>
//          {children}
//        </Text>
//      </View>
//    );
//  };

//  const App = () => {
//    const isDarkMode = useColorScheme() === 'dark';

//    const backgroundStyle = {
//      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//    };

//    return (
//      <SafeAreaView style={backgroundStyle}>
//        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//        <ScrollView
//          contentInsetAdjustmentBehavior="automatic"
//          style={backgroundStyle}>
//          <Header />
//          <View
//            style={{
//              backgroundColor: isDarkMode ? Colors.black : Colors.white,
//            }}>
//            <Section title="Step One">
//              Edit <Text style={styles.highlight}>App.js</Text> to change this
//              screen and then come back to see your edits.
//            </Section>
//            <Section title="See Your Changes">
//              <ReloadInstructions />
//            </Section>
//            <Section title="Debug">
//              <DebugInstructions />
//            </Section>
//            <Section title="Learn More">
//              Read the docs to discover what to do next:
//            </Section>
//            <LearnMoreLinks />
//          </View>
//        </ScrollView>
//      </SafeAreaView>
//    );
//  };

//  const styles = StyleSheet.create({
//    sectionContainer: {
//      marginTop: 32,
//      paddingHorizontal: 24,
//    },
//    sectionTitle: {
//      fontSize: 24,
//      fontWeight: '600',
//    },
//    sectionDescription: {
//      marginTop: 8,
//      fontSize: 18,
//      fontWeight: '400',
//    },
//    highlight: {
//      fontWeight: '700',
//    },
//  });

//  export default App;import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales['pt-BR'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sab.'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-BR';

export default class App extends Component {
  state = {
    isLogged: false,
    user: null,
    isLeader: false,
    userPhoto: undefined,
  }

  async componentDidMount() {
    auth()
      .onAuthStateChanged(async user => {
        user && user.reload()

        const isLogged = user != null
        if (isLogged) {
          // checkFCMPermissions()
          checkUserFromFirestore(user)
        }

        const leader = isLogged ? await isLeader() : false
        console.info('leader', leader)

        this.setState({ isLogged, user: isLogged ? user : null, isLeader: leader, userPhoto: user.photoURL })
        SplashScreen.hide()
      })

    // messaging().onMessage(data => console.info('\nonMessage\n', data))
    // messaging().setBackgroundMessageHandler(data => console.info('\nsetBackgroundMessageHandler\n', data))
  }

  TabNavigators = () => {
    const Tab = createBottomTabNavigator();
    const insets = useSafeAreaInsets();
    const { isLeader, userPhoto } = this.state

    return (
      <Tab.Navigator
        initialRouteName="Home"
        // headerMode="none"
        tabBarOptions={{
          style: {
            height: 70 + insets.bottom,
            borderTopWidth: 3,
            elevation: 0,
            borderTopColor: mainStyle.primaryColor,
          },
          tabStyle: {
            paddingTop: 5,
            paddingBottom: 12,
          },
          activeTintColor: mainStyle.primaryColor,
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = ''

            switch (route.name) {
              case 'calendário':
                iconName = 'calendar'
                break;
              case 'ministérios':
                iconName = 'users'
                break;
              case 'trocas':
                iconName = 'exchange'
                break;
              default:
                break;
            }

            if (route.name !== 'account') {
              return <Icon
                name={iconName}
                color={focused ? mainStyle.primaryColor : color}
                size={20}
              />
            } else {
              console.log('userPhoto', userPhoto)
              return (
                <Image
                  source={{
                    uri: userPhoto,
                    width: 40,
                    height: 40,
                  }}
                  style={{
                    borderRadius: 25
                  }}
                />
              )
            }
          }
        })}>
        <Tab.Screen name={'calendário'} component={HomeScreen} />
        {isLeader && (<Tab.Screen name={'ministérios'} component={MinisterListScreen} />)}
        <Tab.Screen name={'trocas'} component={ChangeRequestsScreen} />
        <Tab.Screen name={'account'} component={ChangeRequestsScreen} />
      </Tab.Navigator>
    )
  }

  render() {
    const { isLogged } = this.state
    console.info('isLogged', isLogged)

    const Stack = createStackNavigator();

    return (
      <NavigationContainer>
        {
          isLogged ?
            (
              <Stack.Navigator headerMode="none" >
                <Stack.Screen name={'Home'} component={this.TabNavigators} />
                <Stack.Screen name={'CreateTask'} component={CreateTask} />
                <Stack.Screen name={'ViewTask'} component={ViewTaskScreen} />
                <Stack.Screen name={'MinisterRegister'} component={MinisterRegister} />
                <Stack.Screen name={'ManageUsers'} component={ManagerUsers} />
              </Stack.Navigator>
            ) :
            (
              <Stack.Navigator initialRouteName="Login" headerMode="none"  >
                <Stack.Screen name={'Login'} component={Login} />
              </Stack.Navigator>
            )
        }
      </NavigationContainer>
    )
  }
}