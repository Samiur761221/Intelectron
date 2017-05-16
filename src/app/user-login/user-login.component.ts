import { Component} from '@angular/core';
import {AF} from "../providers/af";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms"
import { LocalStorageService} from 'ng2-webstorage';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent   {

  constructor(public afService: AF, private router: Router, private storage: LocalStorageService) { }

  userLoginWithCredetial(formObj:any){
	console.log(formObj);
	this.afService.logInwithcredential(formObj).then((data) => {
		this.storage.store("userId",data.auth.uid);
		this.router.navigate(['home']);	
	});
}

}
