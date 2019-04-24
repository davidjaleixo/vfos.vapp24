import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post(environment.apiUrl + `/login`, { email: email, password: password })
            .pipe(map(response => {
                //console.log("this is the answer: " + JSON.stringify(response['token']));
                let token = response['token'];
                // login successful if there's a jwt token in the response
                if (token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('token', JSON.stringify(token));
                }

                return token;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('token');
    }

    register(name: string, email: string, password: string){
        return this.http.post(environment.apiUrl + '/register', { name: name, email: email, password: password})
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);

        if (decoded.exp === undefined) return null;

        const date = new Date(0); 
        date.setUTCSeconds(decoded.exp);
        return date;
      }
    isTokenExpired(token?: string): boolean {
        if(!token) token = localStorage.getItem('token');
        if(!token) return true;

        const date = this.getTokenExpirationDate(token);
        if(date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
      }
    getUserDetails(token?: string): any {
        if(!token) token = localStorage.getItem('token');

        const decoded = jwt_decode(token);
        return { id: decoded._id, name: decoded.name, email: decoded.email}
    }

    getAccId(token?: string):any{
        if(!token) token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
        return decoded._id;
    }

    
}