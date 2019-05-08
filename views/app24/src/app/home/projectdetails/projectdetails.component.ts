import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, EquipmentService } from '../../_services';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {

  project : any;
  user: any;
  equipmentsList: any;

  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private authentication: AuthenticationService,
    private equipmentservice: EquipmentService
  ) { }

  ngOnInit() {
    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log(data);
        this.project = data
    }, err => {
      console.log(err);
    })

    //get user details
    let user = this.authentication.getUserDetails();
    if (user != null){
      this.user = user
    }

    //get the equipment's project list
    this.equipmentservice.getAll(this.project.idprojects).subscribe(
      data => {
        this.equipmentsList = data
      },err => {
        console.log(err);
      }
    )


  }

}
