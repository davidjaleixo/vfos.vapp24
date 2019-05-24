import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {

  projectsList: any;
  user: any;
  newProjectForm: FormGroup;

  constructor(
    private ProjectService: ProjectService, 
    private authentication: AuthenticationService,
    private fb: FormBuilder) { }

  ngOnInit() {
    //get user details
    let user = this.authentication.getUserDetails();
    if (user != null){
      this.user = user
    }

    this.ProjectService.getAll().subscribe(answer => {
      this.projectsList = answer;
      console.log(answer);
    }, err => {
      //TODO
    })

    this.newProjectForm = this.fb.group({
      name: [''],
      description: ['']
    });
  }
  //form getter
  get f() { return this.newProjectForm.controls}

  onSubmit(){
    this.ProjectService.create(this.f.name.value, this.f.description.value).subscribe(data => {
      //add the new project in the list
      this.projectsList.push(data);
      this.newProjectForm.reset();
    }, err => { 
      console.log(err);

    })
  }

}
