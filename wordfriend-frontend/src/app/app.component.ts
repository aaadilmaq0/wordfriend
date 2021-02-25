import { AfterViewInit, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'wordfriend-frontend';

  constructor(private spinnerService:SpinnerService, private spinner:NgxSpinnerService){

  }
  
  ngAfterViewInit(){
    this.spinnerService.httpProgress().subscribe((status: boolean) => {
      if(status) this.spinner.show();
      else this.spinner.hide();
    });
  }
}
