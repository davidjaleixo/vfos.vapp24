import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm : FormGroup;
    returnUrl : string;
    submitted : boolean;
    loading : boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    //create the login form
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });

    //get return url from route parameters or default to /
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  //getter for the form
  get f() { return this.loginForm.controls }

  onSubmit(){
    this.submitted = true;
    if(this.loginForm.invalid){
      return;
    }
    this.loading = true;
    
  }
}
