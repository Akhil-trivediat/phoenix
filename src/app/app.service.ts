import {Injectable} from '@angular/core';

Injectable()
export class AppService {
    public static savedToken;
    public static isLoggedIn = false;
    constructor() {
        console.log('angular service');
    }

    static saveToken(token) {
        AppService.savedToken = token;
    }

    static setLogin(isLoggedIn: boolean) {
        AppService.isLoggedIn = isLoggedIn;
    }

    static get token() {
        return AppService.savedToken;
    }
}