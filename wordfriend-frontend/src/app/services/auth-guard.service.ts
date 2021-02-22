import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { of as observableOf, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private toastr: ToastrService) { }

  canActivate(): Observable<any> {
    let token = this.auth.getToken();
    if(!token){
      this.auth.logout();
      return observableOf(false);
    } else{
      return this.auth.isAuthenticated().pipe(
        map(response => {
          this.auth.setUser(response["user"]);
          return true;
        }),
        catchError(error => {
          console.log(error);
          this.toastr.warning(error.error && error.error.msg ? error.error.msg : "Please Login Again");
          this.auth.logout();
          return observableOf(false);
        })
      );
    }
  }
}
