import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { of as observableOf, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private auth: AuthService, private router:Router) { }

  canActivate(): Observable<any> {
    let token = this.auth.getToken();
    if(!token){
      return observableOf(true);
    } else{
      return this.auth.isAuthenticated().pipe(
        map(response => {
          this.auth.setUser(response["user"]);
          this.router.navigate(["main"]);
          return false;
        }),
        catchError(error => {
          console.log(error);
          return observableOf(true);
        })
      );
    }
  }
}
