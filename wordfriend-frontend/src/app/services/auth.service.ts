import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { user } from '../app.model';

const uri = "/api/auth"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:user = null;

  constructor(private http:HttpClient, private router: Router) { }

  completeOAuthSignIn(idToken, method){
    return this.http.get(`${uri}/completeOAuthSignIn`, { params: { idToken, method }});
  }

  isAuthenticated(){
    let token = this.getToken();
    return this.http.get(`${uri}/isAuthenticated`, { params: { token }});
  }

  setUser(user){
    this.user = user;
  }

  setToken(token){
    localStorage.setItem("token", token);
  }

  getToken(){
    return localStorage.getItem("token");
  }

  startLogout(){
    let token = this.getToken();
    return this.http.get(`${uri}/logout`, { params: { token }});
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(["auth","login"]);
  }

}
