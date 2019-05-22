import { Component, OnInit } from '@angular/core';

import { ProjectService, AuthenticationService, EquipmentService, SlumpService, NotificationService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications : any;
  constructor(
    private router: ActivatedRoute,
    private notificationservice: NotificationService) { }

  ngOnInit() {
    this.notificationservice.getNotifications().subscribe(
      data => {
        this.notifications = data;
      },err => {
        console.log(err);
      }
    )
  }

}
