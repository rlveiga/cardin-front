import { observable, action } from 'mobx';
import UserService from '../services/userService';

export default class UserStore {
    @observable name = '';
    @observable username = '';
    @observable token = '';
    @observable success = false;

    @action
    async login(username, password) {
        this.success = false;

        await UserService.login(
            username,
            password
        ).then(response => {
            console.log(response)
            
            if(response.status == 200) {
                this.success = true;
                this.name = response.data.user.name;
                this.username = response.data.user.username;
                this.token = response.data.token;
            }
        }, err => {
            console.log(err)
        }) 
    }
}