import { Component, OnInit } from '@angular/core';
import { AuthenticationService, NotificationService } from '../../_services';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  user: any;
  notifications: any;
  unread: any;

  constructor(private authentication: AuthenticationService, private notification: NotificationService) { }

  ngOnInit() {

    let user = this.authentication.getUserDetails();
    if (user != null){
      this.user = user
    }
    this.unread = [];
    //get unread notifications
    this.notification.getNotifications().subscribe(
      data => {
        this.notifications = data;
        this.notifications.forEach(eachNotification => {
          if(eachNotification.read == 'f'){
            this.unread.push(eachNotification)
          }
        })
      }, err => {
        console.log(err);
      }
    )

  }
  logout(){
    this.authentication.logout();
  }



}
