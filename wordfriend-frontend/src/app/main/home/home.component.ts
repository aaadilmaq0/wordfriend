import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private auth:AuthService, private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  logout(){
    this.auth.startLogout().toPromise()
    .then(() => {
      this.auth.logout();
    })
    .catch(error => {
      this.toastr.error(error.error && error.error.msg ? error.error.msg : "Error Logging Out!");
    });
  }

}
