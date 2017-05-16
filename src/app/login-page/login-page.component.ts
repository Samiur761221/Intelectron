
// src/app/login-page/login-page.component.ts
import { Component } from '@angular/core';
import {AF} from "../providers/af";
import {Router} from "@angular/router";
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import { LocalStorageService} from 'ng2-webstorage';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
	
  constructor(public afService: AF, private router: Router, private storage: LocalStorageService) {
    this.afService.af.auth.subscribe((data)=>{
  if(data)
    this.router.navigate(['home']);
    });
  }
  login() {
    this.afService.loginWithGoogle().then((data) => {
		console.log(data);
	    //this.storage.store("userId",data.auth.uid);
      //this.router.navigate(['home']);
    })
  }
  loginWithFb() {
    this.afService.loginWithFacebook().then((data) => {
      console.log(data.auth.providerData[0].providerId);
	    ///this.storage.store("userId",data.auth.uid);
      //this.router.navigate(['home']);
    })
  }
  registerPage(){
	  this.router.navigate(['register']); 
  }
   userLogin(){
	  this.router.navigate(['userLogin']); 
  } 
   userLoginWithCredetial(formObj:any){
	console.log(formObj);
	this.afService.logInwithcredential(formObj).then((data) => {
		this.storage.store("userId",data.auth.uid);
		this.router.navigate(['home']);	
	});
}

}