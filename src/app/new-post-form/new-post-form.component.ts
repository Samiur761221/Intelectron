import { Component , ViewChild, OnChanges } from '@angular/core';
import {AF} from "../providers/af";
import {Router} from "@angular/router";
import { LocalStorageService} from 'ng2-webstorage';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFire} from 'angularfire2';
import {FormsModule} from "@angular/forms"

@Component({
  selector: 'app-new-post-form',
  templateUrl: './new-post-form.component.html',
  styleUrls: ['./new-post-form.component.css']
})
export class NewPostFormComponent   {
	private userId: string;
	private downloadURL: string;
	private postId: string;
  constructor(public afService: AF, 
  private router: Router, public store: LocalStorageService,
  private af:AngularFire) {
	this.userId=this.store.retrieve("userId");
	this.postId=this.afService.makeid();
  }

   createNewPost(formData:any) {
	  let userData: any=formData;
	  userData.postId=this.postId;
	  userData.coments="";
	  userData.like="";
	  userData.disLike="";
	  userData.dateTime=this.afService.getDatetime();
	  console.log(userData);
	  this.af.database.object('allPosts/'+this.userId+'/'+this.postId+"/postHeading").
	  set(formData.postHeading);
	  this.af.database.object('allPosts/'+this.userId+'/'+this.postId+"/postTopic").
	  set(formData.postTopic);
	  this.af.database.object('allPosts/'+this.userId+'/'+this.postId+"/postId").
	  set(this.postId);
	  this.af.database.object('allPosts/'+this.userId+'/'+this.postId+"/userId").
	  set(this.userId);
	  this.af.database.object('/users/'+this.userId+'/posts/'+this.postId+'/postDetails').
	  set(userData).then(_ => {this.router.navigate(['home']);});
  }
  uploadPostImg(){
	this.afService.uploadFile("postImg")
	.then(snapshot => {
	this.af.database.object('allPosts/'+this.userId+'/'+this.postId+'/postImg')
	.set(snapshot.downloadURL)
	this.af.database.object('/users/'+this.userId+'/posts/'+this.postId+'/postImg')
	.set(snapshot.downloadURL)
	});
  }
}
