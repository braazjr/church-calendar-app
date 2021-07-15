import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

import {getLoggedUser, logoff} from '../../services/authentication';
import {User} from '../../models/user-model';
import {mainStyleColors, mainStyles} from '../../../config/styles';
import {updateUser} from '../../services/user';
import {getMinisters} from '../../services/minister';
import LoadingComponent from '../../components/loading.component';
import InfoBoxComponent from '../../components/info-box.component';

export default class AccountScreen extends Component {
  state = {
    isLoading: false,
    user: new User(),
    name: undefined,
    photoUrl: undefined,
    editingName: false,
    ministers: [],
    ministersLead: [],
  };

  async componentDidMount() {
    let user = await getLoggedUser();
    user.photoUrl = user.photoUrl?.replace('s96-c', 's400-c');

    this.getMinisters(user.ministers, user.ministersLead);

    this.setState({user, name: user.name, photoUrl: user.photoUrl});
  }

  updateUserName(name) {
    let {user} = this.state;
    updateUser(user.id, {name})
      .then(() =>
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'sucesso',
          text2: 'seu nome foi atualizado!',
        }),
      )
      .catch(() =>
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'erro',
          text2: 'ocorreu um erro ao atualizar seu nome!',
        }),
      )
      .finally(() => {
        user.name = name;
        this.setState({user, name});
      });
  }

  getMinisters(ministers, ministersLead) {
    getMinisters().onSnapshot(data => {
      const ms = data
        .docChanges()
        .filter(doc => ministers?.includes(doc.doc.id));

      const msl = data
        .docChanges()
        .filter(doc => ministersLead?.includes(doc.doc.id));

      this.setState({
        ministers: ms.map(doc => doc.doc.data()),
        ministersLead: msl.map(doc => doc.doc.data()),
      });
    });
  }

  loadAndCroppedPhoto() {
    const {user} = this.state;

    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(async image => {
      this.setState({isLoading: true});

      const imageStorage = await storage()
        .ref(`users/${user.id}/photo_profile`)
        .putFile(image.path, {});

      if (imageStorage.error) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'erro',
          text2: 'ocorreu um erro ao salvar nova foto!',
        });
      }

      const downloadUrl = await storage()
        .ref(`users/${user.id}/photo_profile`)
        .getDownloadURL();

      console.log('downloadUrl', downloadUrl);

      await this.updatePhoto(downloadUrl);
    });
  }

  async updatePhoto(photoUrl) {
    let {user} = this.state;
    return updateUser(user.id, {photoUrl})
      .catch(() =>
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'erro',
          text2: 'ocorreu um erro ao atualizar sua foto!',
        }),
      )
      .then(() =>
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'sucesso',
          text2: 'sua foto foi atualizada! em breve estará disponível!',
        }),
      )
      .finally(() => {
        // user.photoUrl = photoUrl
        this.setState({user, photoUrl, isLoading: false});
      });
  }

  logoff() {
    logoff();
  }

  render() {
    const {
      state: {
        isLoading,
        user,
        name,
        photoUrl,
        editingName,
        ministers,
        ministersLead,
      },
    } = this;

    return (
      <>
        <LoadingComponent isLoading={isLoading}>
          <View
            style={{
              flex: 1,
              // marginTop: hasNotch() ? 50 : 20,
              marginTop: 50,
              backgroundColor: '#fff',
            }}>
            {/* <View
              style={{
                width: '100%',
                height: Dimensions.get('window').height,
                marginTop: 10,
              }}
            > */}
            {/* <Text style={styles.title}>
              conta
            </Text> */}
            <ScrollView
              contentContainerStyle={{
                paddingBottom: '10%',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: photoUrl}}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    marginTop: '5%',
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.loadAndCroppedPhoto();
                  }}>
                  <Text
                    style={{
                      marginVertical: 10,
                      color: mainStyleColors.primaryColor,
                    }}>
                    upload foto
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginTop: '10%',
                  marginHorizontal: '8%',
                }}>
                <View>
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                    nome
                  </Text>

                  <View
                    style={{
                      height: 25,
                      marginTop: 3,
                      flexDirection: 'row',
                    }}>
                    {editingName ? (
                      <TextInput
                        style={{
                          fontSize: 19,
                          flex: 4,
                        }}
                        onChange={text =>
                          this.setState({name: text.nativeEvent.text})
                        }
                        value={name}
                        placeholder="pesquise novo ministro"
                      />
                    ) : (
                      <Text
                        style={{
                          fontSize: 19,
                          flex: 4,
                        }}>
                        {user.name}
                      </Text>
                    )}
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                      }}
                      onPress={() => {
                        if (editingName) {
                          this.updateUserName(name);
                        }
                        this.setState({editingName: !editingName});
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          marginRight: '5%',
                          color: mainStyleColors.primaryColor,
                        }}>
                        {editingName ? 'salvar' : 'editar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#979797',
                    alignSelf: 'center',
                    marginTop: 10,
                    marginBottom: 30,
                  }}
                />
                <View>
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                    email
                  </Text>
                  <View
                    style={{
                      height: 25,
                      marginTop: 3,
                    }}>
                    <Text style={{fontSize: 19}}>{user.email}</Text>
                  </View>
                </View>
                <View
                  style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#979797',
                    alignSelf: 'center',
                    marginVertical: 10,
                  }}
                />

                <View style={{marginTop: 25}}>
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                    ministérios que estou
                  </Text>
                  <View
                    style={{
                      // height: 25,
                      marginTop: 3,
                    }}>
                    {ministers.length == 0 && (
                      <InfoBoxComponent
                        // title={'teste'}
                        description={'você ainda não está em nenhum ministério'}
                      />
                    )}
                    {ministers.map((minister, index) => (
                      <Text key={index} style={{fontSize: 14}}>
                        <Icon name={'check'} color={'#9CAAC4'} size={20} />{' '}
                        {minister.name}
                      </Text>
                    ))}
                  </View>
                </View>

                <View
                // style={{ marginTop: 25 }}
                >
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 14,
                      fontWeight: '600',
                      marginTop: 15,
                    }}>
                    lider em
                  </Text>
                  <View
                    style={{
                      // height: 25,
                      marginTop: 3,
                    }}>
                    {ministersLead.length == 0 && (
                      <InfoBoxComponent
                        // title={'teste'}
                        description={'você não é líder de nenhum ministério'}
                      />
                    )}
                    {ministersLead.map((minister, index) => (
                      <Text key={index} style={{fontSize: 14}}>
                        <Icon name={'check'} color={'#9CAAC4'} size={20} />{' '}
                        {minister.name}
                      </Text>
                    ))}
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    mainStyles.button,
                    {
                      height: 42,
                      marginVertical: ministersLead.length == 0 ? 20 : 30,
                    },
                  ]}
                  onPress={() => this.logoff()}>
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: '#fff',
                    }}>
                    deslogar
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            {/* </View> */}
          </View>
        </LoadingComponent>
      </>
    );
  }
}
