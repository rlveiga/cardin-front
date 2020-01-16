import { observable, action } from 'mobx';
import UserService from '../services/userService';

export default class UserStore {
    @observable name = '';
    @observable email = '';
    @observable token = '';
    @observable success = false;

    @action
    async login(email, password) {
        this.success = false;

        await UserService.login(
            email,
            password
        ).then(res => {
            console.log(res)
            if(res.data.success) {
                this.success = true;
                this.name = res.data.user.name;
                this.email = res.data.user.email;
                this.token = res.data.token;
            }
        }, err => {
            console.log(err.response)
        }) 
    }
}