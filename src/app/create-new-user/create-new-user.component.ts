import { Component, OnInit } from '@angular/core';
import {AF} from "../providers/af";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.css']
})
export class CreateNewUserComponent  {

  constructor(public afService: AF, private router: Router) { }

  
createNewUser(formObj:any){
	console.log(formObj);
	this.afService.createUser(formObj.email,formObj.passWord).then((data) => {
		this.afService.sendVerficationEmail().then((result)=>{
			console.log(result);
		});
		console.log(data);
	});
}
}
