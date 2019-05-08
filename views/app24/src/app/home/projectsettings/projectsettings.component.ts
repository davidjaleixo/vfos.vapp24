import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, EquipmentService, UserService, AccountsService } from '../../_services';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-projectsettings',
  templateUrl: './projectsettings.component.html',
  styleUrls: ['./projectsettings.component.css']
})
export class ProjectsettingsComponent implements OnInit {

  project: any;
  unsetProject: any;
  equipments: any;
  eqName: String;
  users: any;
  availableusers: any;
  selectedUser: any;
  user: any;
  newUserForm: FormGroup;

  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private rou: Router,
    private authentication: AuthenticationService,
    private equipmentservice: EquipmentService,
    private alert: ToastrService,
    private userservice: UserService,
    private accountservice: AccountsService,
    private fb: FormBuilder) { }

  getUsersOnProject() {
    this.userservice.getOnProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.users = data;
        console.log("users", data);
      }, err => {
        console.log(err);
      }
    )
  }

  ngOnInit() {
    this.eqName = '';



    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.project = data;
        this.unsetProject = data;
      }, err => {
        console.log(err);
      })


    this.equipmentservice.getAll(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        this.equipments = data;
      }, err => {
        console.log("err", err);
      }
    )

    this.getUsersOnProject();

    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user;
      console.log("getting available user unless this one ", this.user.id);
      this.accountservice.getAvailableUsers(this.user.id).subscribe(
        data => {
          this.availableusers = data;
          this.newUserForm = this.fb.group({
            user: [this.availableusers[0]],
          });
          console.log("available users:", data);
        }, err => {
          console.log("available users", err);
        }
      )

    }
  }

  updateName(projectId) {
    this.projectservice.updateName(projectId, this.project.name).subscribe(
      data => {
        this.alert.success('Name updated');
        this.unsetProject.name = this.project.name;
      }, err => {
        this.alert.error('Name not updated');
        this.project.name = this.unsetProject.name
      }
    )
  }

  updateDescription(projectId) {
    this.projectservice.updateDescription(projectId, this.project.description).subscribe(
      data => {
        this.alert.success('Description updated');
        this.unsetProject.description = this.project.description;
      }, err => {
        this.alert.error('Description not updated');
        this.project.description = this.unsetProject.description
      }
    )
  }

  updateStatus(projectId) {
    let newStatus = { boolean: false, value: 'f', previous: 'f' };
    if (this.project.status == 't') {
      newStatus.boolean = false;
      newStatus.value = 'f';
      newStatus.previous = 't';
    } else {
      newStatus.boolean = true;
      newStatus.value = 't';
      newStatus.previous = 'f';
    }
    this.projectservice.updateStatus(projectId, newStatus.boolean).subscribe(
      data => {
        this.alert.success('Status updated');
        this.project.status = newStatus.value;
        this.unsetProject.status = newStatus.value;
      }, err => {
        this.alert.error('Status not updated');
        this.project.status = newStatus.previous;
        this.unsetProject.status = newStatus.previous;
      }
    )
  }

  updateThold(projectId) {
    this.projectservice.updateThreshold(projectId, this.project.threshold).subscribe(
      data => {
        this.alert.success('Threshold updated');
        this.unsetProject.threshold = this.project.threshold;
      }, err => {
        this.alert.error('Threshold not updated');
        this.project.threshold = this.unsetProject.threshold
      }
    )
  }

  deleteProject(projectId) {
    this.projectservice.delete(projectId).subscribe(
      data => {
        this.alert.success('Project deleted');
        this.rou.navigate(['/home/projects']);
      }, err => {
        this.alert.error('Project not deleted');
      })
  }

  createEquipment() {
    console.log("this is the name ", this.eqName);
    this.equipmentservice.create(this.eqName, this.project.idprojects).subscribe(data => {
      this.alert.success("Equipment created")
      this.ngOnInit();
    }, err => {
      this.alert.error("Equipment not created")

    })
  }

  deleteEq(id) {
    this.equipmentservice.delete(id).subscribe(data => {
      this.alert.success("Equipment deleted")
      this.ngOnInit();
    }, err => {
      this.alert.error("Equipment not deleted")
    })
  }
  addUser() {
    this.userservice.allocate(this.newUserForm.controls.user.value.idaccounts, this.project.idprojects).subscribe(
      data => {
        this.alert.success("User has been added to this project");
        this.getUsersOnProject();
      }, err => {
        this.alert.error("User was not added to the project");
        console.log(err);
      }
    )
    this.newUserForm.reset();

  }
  deleteUser(AllocationId){
    this.userservice.unAllocate(AllocationId).subscribe(data => {
      this.alert.success("User has been deleted from this project")
      this.getUsersOnProject();
    },err => {
      this.alert.error("User was not deleted from the project");
      console.log(err);
    })
  }

}
