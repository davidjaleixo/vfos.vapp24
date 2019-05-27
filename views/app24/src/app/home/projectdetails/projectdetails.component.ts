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

  compositions:any;

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
    if (this.f.supplierid.value != "" && this.f.value.value != 0) {
      console.log("value", this.f.value.value);
      console.log("supplier:", this.f.supplierid.value.idsuppliers);
      console.log("composition: ", this.f.compositionid.value.idcompositions);
      
      this.slumpservice.registerTest(this.f.value.value, this.f.compositionid.value.idcompositions, this.project.idprojects, this.f.supplierid.value.idsuppliers, this.f.loadid.value).subscribe(
        data => {
          console.log(data);
          this.alert.success("Test was saved")
      }, err => {

        this.alert.error("Error ")
      })
    }
    
  }

}
