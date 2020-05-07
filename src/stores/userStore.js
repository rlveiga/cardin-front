import { observable, action } from 'mobx';
import UserService from '../services/userService';

export default class UserStore {
  @observable id
  @observable name
  @observable username
  @observable token

  @observable errorMsg
  @observable success = false;

  @action
  async register(username, password, profile_color) {
    this.success = false;
    this.errorMsg = ''

    await UserService.register(
      username,
      password,
      profile_color
    ).then(response => {
      console.log(response)
      
      if(response.status == 201) {
        this.success = true
      }

      else {
        this.errorMsg = response.data.message
      }
    }, error => {
      console.log(error)
    })
  }
  
  @action
  async login(username, password) {
    this.success = false;
    this.errorMsg = ''

    await UserService.login(
      username,
      password
    ).then(response => {
      console.log(response)

      if (response.status == 200) {
        this.success = true;
        this.id = response.data.user.id;
        this.name = response.data.user.name;
        this.username = response.data.user.username;
        this.source = response.data.user.source;
        this.profile_color = response.data.user.profile_color;

        this.token = response.data.token;
      }

      else {
        this.errorMsg = response.data.message
      }
    }, err => {
      console.log(err)
    })
  }

  @action
  async fbLogin(fb_access_token) {
    this.success = false;

    await UserService.fbLogin(
      fb_access_token
    ).then(response => {
      console.log(response)

      if (response.status == 200) {
        this.success = true;
        this.id = response.data.user.id;
        this.name = response.data.user.name;
        this.username = response.data.user.username;
        this.source = response.data.user.source;

        this.token = response.data.token;
      }
    }, err => {
      console.log(err)
    })
  }
}