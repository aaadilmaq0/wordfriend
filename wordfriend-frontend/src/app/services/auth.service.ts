import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { user } from '../app.model';

const uri = "/api/auth"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:user = null;

  constructor(private http:HttpClient, private router: Router, private toastr: ToastrService) { }

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
    this.http.get(`${uri}/logout`, { params: { token }}).toPromise()
    .then(() => {
      this.logout();
    })
    .catch(error => {
      this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error Logging Out!");
    });
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(["auth","login"]);
  }

}
