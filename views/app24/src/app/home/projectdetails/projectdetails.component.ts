import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, SupplierService, CompositionsService, SlumpService } from '../../_services';
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
  suppList: any;

  compositions: any;

  newslump: FormGroup;


  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private authentication: AuthenticationService,
    private supplierservice: SupplierService,
    private slumpservice: SlumpService,
    private fb: FormBuilder,
    private alert: ToastrService,
    private compositionservice: CompositionsService
  ) { }

  ngOnInit() {

    //init the slumptest form
    this.newslump = this.fb.group({
      value: [''],
      supplierid: [''],
      compositionid: [''],
      loadid: ['']
    });


    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log(data);
        this.project = data;
        //get the suppliers's project list
        this.suppList = "hello";
        this.supplierservice.getAll(this.project.idprojects).subscribe(
          data => {
            console.log("List of suppliers: ", data);
            this.suppList = data
            console.log("List of suppliers: ", this.suppList);
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

    //get available compositions for this project
    this.compositionservice.getCompByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log("we have this compositions available: ", data);
        this.compositions = data;
      }, err => {
        console.log(err)
      }
    )
  }

  //getter
  get f() { return this.newslump.controls }



  saveSlump() {

    if (this.f.supplierid.value != "" && this.f.value.value != 0 && this.f.compositionid.value.idcompositions != "" && this.f.loadid.value != "") {
      console.log("max:", this.f.compositionid.value.tholdmax);
      console.log("min:", this.f.compositionid.value.tholdmin);
      if (this.f.value.value >= this.f.compositionid.value.tholdmax || this.f.value.value <= this.f.compositionid.value.tholdmin) {

        var result = confirm("The slump test value is out of threshold's range - Notification will be sent!");
        if (result) {
          this.slumpservice.registerTest(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
            data => {
              this.alert.success("Test was saved")
              this.newslump.reset();
            }, err => {
              this.alert.error("Error ")
            })
        }else{
          this.alert.info("Test was not stored by your decision");

        }

      } else {
        this.slumpservice.registerTest(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
          data => {
            this.alert.success("Test was saved")
            this.newslump.reset();
          }, err => {

            this.alert.error("Error ")
          })
      }
    } else {
      this.alert.error("Please insert all the fields")
    }
  }

}
