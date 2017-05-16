import { Component,Input } from '@angular/core';
import {AF} from "../providers/af";
import {Router} from "@angular/router";
import { LocalStorageService} from 'ng2-webstorage';
import {NgbModal,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFire} from 'angularfire2';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../user-dashboard/user-dashboard.component.css','./profile.component.css']
})
export class ProfileComponent  {

 private basicDetails: Object;
 public dataAvailable: boolean=false;
 private editable=false;
 private defaultAvatar: string= "src/app/img/Default-avatar.jpg";
 private posts: Array<any>=[];
 public profilePics: string;
 private modal: any;
  constructor(public afService: AF, private router: Router, 
  private storage: LocalStorageService, private modalService:NgbModal,
  private af: AngularFire) {
  
  this.afService.getAllData("users/"+this.storage.retrieve("userId")).subscribe(snapshots => {
		if(!snapshots.length){
			this.router.navigate(['basicDetailsForm']);	
			this.dataAvailable=false;
		}
			
		else{
			this.dataAvailable=true;
			this.basicDetails=snapshots[1];
			this.profilePics=snapshots[0].$value;
			console.log(this.basicDetails);

		}
	});

	
 

}
openCustom(content){
       this.modal=this.modalService.open(content);
}
uploadProfileImage(){
	let userId=this.storage.retrieve("userId");
	this.afService.uploadFile("profileImage")
	.then(snapshot => {
	this.af.database.object("users/"+userId+"/avatar").
	set(snapshot.downloadURL).then(_ => { this.modal.dismiss('picture uploaded');});
	});
}

editForm(){
this.editable=true;	
}
basicDetailsSubmit(formData:any) {
	 let userId=this.storage.retrieve("userId");
	 this.af.database.object('userMap/'+userId).set(formData.name);
	 this.af.database.object('/users/'+userId+'/basicDetails').set(formData).then(_ => {this.editable=false;});
  }
}
