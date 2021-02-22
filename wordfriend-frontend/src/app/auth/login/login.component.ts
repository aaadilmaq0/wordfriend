import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from "angularx-social-login";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private socialAuthService:SocialAuthService,
    private auth:AuthService,
    private toastr:ToastrService,
    private router:Router
  ) { }

  ngOnInit(): void {

  }

  signInWithGoogle(){
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((user: SocialUser) => {
      this.auth.completeOAuthSignIn(user.idToken, "google")
      .toPromise()
      .then(response => {
        this.auth.setToken(response["token"]);
        this.router.navigate(["main"]);
      })
      .catch(error => {
        console.log(error);
        this.toastr.error(error.error && error.error.msg ? error.error.msg : "Unable To Login!");
      });
    });
  }

}
