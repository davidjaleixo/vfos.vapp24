import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  acctypes: any;

  constructor(
    private fb: FormBuilder,
    private authentication: AuthenticationService,
    private router: Router,
    private alert: ToastrService
  ) { }

  ngOnInit() {
    //create the register form
    this.registerForm = this.fb.group({
      username: [''],
      password: [''],
      passwordrepeat: [''],
      type: ['']
    });
    this.acctypes = [{name: 'Admin', value: 2},{name: 'Contractor', value: 1},{name: 'Provider', value: 3}];
  }
  //getter for the form
  get f() { return this.registerForm.controls }

  onSubmit() {
    console.log("submit...");

    //check eq password
    if (this.f.password.value == this.f.passwordrepeat.value) {
      this.authentication.register(this.f.username.value, this.f.password.value, this.f.type.value)
        .pipe(first())
        .subscribe(data => {
          console.log("register: ", data);
          
            this.router.navigate(['home'])
          
        }, err => {
          console.log(err);
        })
    } else {
      this.alert.error("Passwords should match")
    }


  }

}
