import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  user: any;

  constructor(private authentication: AuthenticationService) { }

  ngOnInit() {

    let user = this.authentication.getUserDetails();
    if (user != null){
      this.user = user
    }
    
  }
  logout(){
    this.authentication.logout();
  }



}
