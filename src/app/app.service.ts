import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../app/shared/service/auth.service';
import { Tokens } from './models/token.model'

const jwt = new JwtHelperService();

Injectable()
export class AppService {
    public static savedToken;
    isSessionValid: boolean = false; 
    private loggedUser: string;
    private readonly JWT_TOKEN = 'JWT_TOKEN';
    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

    constructor(
        private authService: AuthService
    ) { 
        this.isSessionActive();
    }

    doLoginUser(username: string, tokens: Tokens) {
        this.loggedUser = username;

    }

    storeTokens(tokens: Tokens) {
        localStorage.setItem(this.JWT_TOKEN, tokens.jwt);  
        localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
    }














    static saveToken(token) {// login serialize, user-manage serv, auth.serv
        let jwtToken:any;
        AppService.savedToken = token;
        jwtToken = token.getSignInUserSession().getAccessToken().getJwtToken();
        localStorage.setItem('com.pheonix.token', jwtToken);
    }

    // static setLogin(isLoggedIn: boolean) {// login serialize, user-manage serv, auth.serv
    //     AppService.isLoggedIn = isLoggedIn;
    // }

    static get token() { // navbar, main
        return AppService.savedToken;
    }
// ************************************************ //
    storeCurrentSessionData(sessionData: any) {
        let user: any = {};
        const token = sessionData.getSignInUserSession().getAccessToken().getJwtToken();
        user = {
        email: jwt.decodeToken(token).username
        };
        const expDate = jwt.getTokenExpirationDate(token);

        localStorage.setItem('token', token);
        localStorage.setItem('user', user.email);
        localStorage.setItem('expDate', expDate.toString());
    }

    static get currentSessionData() {
        return true;
    }

    setLogin(isLoggedIn: boolean) {// login serialize, user-manage serv, auth.serv
        this.isSessionValid = isLoggedIn;
    }

    get isLoggedIn() {
        return this.isSessionValid;
    }

    isSessionActive() {
        // this.authService.getAuthorizationToken().subscribe(
        //     (token) => {
        //         let exp_date = jwt.getTokenExpirationDate(token);
        //         let now: Date = new Date();
        //         this.setLogin(now < exp_date);
        //         return now < exp_date;
        //     }
        // );
        //this.auth
        // return from(Auth.currentSession()).pipe(
        //     map((session) => {
        //      // session.getIdToken().getJwtToken()
        //      let exp_date = jwt.getTokenExpirationDate(session.getIdToken().getJwtToken());
        //      let now: Date = new Date();
        //      return now < exp_date;
        //     })
        // );
    }



    // set isSessionValid(isSessionValid: boolean) {
    //     this.isSessionActive = isSessionValid;
    // }

    // get isSessionValid(){
    //     // return from(Auth.currentSession()).pipe(
    //     //     map((session) => {
    //     //      // session.getIdToken().getJwtToken()
    //     //      let exp_date = jwt.getTokenExpirationDate(session.getIdToken().getJwtToken());
    //     //      let now: Date = new Date();
    //     //      return now < exp_date;
    //     //     })
    //     //   );

    //    // return this.isSessionActive;
    //     return true;
    // }


}