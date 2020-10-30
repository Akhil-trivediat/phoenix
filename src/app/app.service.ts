import {Injectable} from '@angular/core';

Injectable()
export class AppService {
    public static savedToken;
    public static isLoggedIn = false;
    constructor() {
        console.log('angular service');
    }

    static saveToken(token) {
        let jwtToken:any;
        AppService.savedToken = token;
        jwtToken = token.getSignInUserSession().getAccessToken().getJwtToken();
        localStorage.setItem('com.pheonix.token', jwtToken);
    }

    static setLogin(isLoggedIn: boolean) {
        AppService.isLoggedIn = isLoggedIn;
    }

    static get token() {
        return AppService.savedToken;
    }
}