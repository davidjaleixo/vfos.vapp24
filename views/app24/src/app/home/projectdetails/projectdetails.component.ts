import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, EquipmentService, SlumpService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {

  project: any;
  user: any;
  equipmentsList: any;

  newslump: FormGroup;

  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private authentication: AuthenticationService,
    private equipmentservice: EquipmentService,
    private slumpservice: SlumpService,
    private fb: FormBuilder,
    private alert: ToastrService,
  ) { }

  ngOnInit() {

    //init the slumptest form
    this.newslump = this.fb.group({
      value: [''],
      eqid: ['']
    });


    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log(data);
        this.project = data;
        //get the equipment's project list

        this.equipmentservice.getAll(this.project.idprojects).subscribe(
          data => {
            console.log("List of equipments: ", data);
            this.equipmentsList = data
          }, err => {
            console.log(err);
          }
        )
      }, err => {
        console.log(err);
      })

    //get user details
    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user
    }
  }

  //getter
  get f() { return this.newslump.controls }

  saveSlump() {
    if (this.f.eqid.value != "" && this.f.value.value != 0) {
      console.log("value:::::", this.f.eqid.value.idequipments, this.project.idprojects);
      this.slumpservice.registerTest(this.f.value.value, this.f.eqid.value.idequipments, this.project.idprojects, this.project.threshold).subscribe(
        data => {
          console.log(data);
          this.alert.success("Test was saved")
      }, err => {

        this.alert.error("Error ")
      })
    }
    console.log("eq: ", this.f.eqid.value, "value ", this.f.value.value);
  }

}
