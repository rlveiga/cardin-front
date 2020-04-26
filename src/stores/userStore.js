import { observable, action } from 'mobx';
import UserService from '../services/userService';

export default class UserStore {
  @observable id
  @observable name
  @observable username
  @observable token
  @observable success = false;

  @action
  async login(fb_access_token) {
    this.success = false;

    await UserService.login(
      fb_access_token
    ).then(response => {
      console.log(response)

      if (response.status == 200) {
        this.success = true;
        this.id = response.data.user.id;
        this.username = response.data.user.name;

        this.token = response.data.token;
      }
    }, err => {
      console.log(err)
    })
  }
}