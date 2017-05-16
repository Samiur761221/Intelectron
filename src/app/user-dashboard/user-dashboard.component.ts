import { Component , ViewChild, OnChanges } from '@angular/core';
import {AF} from "../providers/af";
import {Router} from "@angular/router";
import { LocalStorageService} from 'ng2-webstorage';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFire} from 'angularfire2';



@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})


export class UserDashboardComponent {
 private basicDetails: Object;
 private dataAvailable: boolean=false;
 private defaultAvatar: string= "src/app/img/Default-avatar.jpg";
 private posts: Array<any>=[];
 private profilePics: string;
 private postAvailable: boolean=false;
 private likeFlag: boolean=false;
 private dislikeFlag: boolean=false;
 private allPosts: Array<Object>;
 private userId: string="";
  constructor(public afService: AF, private router: Router, 
  private storage: LocalStorageService, private modalService:NgbModal,
  private af: AngularFire) {
   this.userId=this.storage.retrieve("userId");
   if(this.userId)
  this.afService.getAllData("users/"+this.userId).subscribe(snapshots => {
		if(!snapshots.length){
			this.router.navigate(['basicDetailsForm']);	
			this.dataAvailable=false;
		}
		else{
			this.dataAvailable=true;
			this.basicDetails=snapshots[1];
			this.profilePics=snapshots[0].$value;
			let posts: Array<any>=[];
			if(snapshots[2])
			for (var snapshot in snapshots[2]){
				posts.push(snapshots[2][snapshot]);
				if(snapshots[2][snapshot])
					this.postAvailable=true;
			}
			this.posts=posts;
			console.log(this.posts);
			
		}
	});
this.afService.getAllData("allPosts").subscribe(snapshots => {
	let postHeadArr: Array<any>=[];
	for (var snapshot in snapshots){
		for(var postId in snapshots[snapshot]  )
		{			
			postHeadArr.push(snapshots[snapshot][postId]);
		}		
	}
		this.allPosts=postHeadArr;
});

	
 

}

openCustom(content){
       this.modalService.open(content);
}
uploadProfileImage(){
	this.afService.uploadFile("profileImage")
	.then(snapshot => {
	console.log(snapshot.downloadURL);
	this.af.database.object("users/"+this.userId+"/avatar").set(snapshot.downloadURL)
	});
}
likedThepost(postId: string,dom: any){
	this.af.database.object("users/"+this.userId+"/posts/"+postId+"/postDetails/like/"+this.userId).set(1)
	.then(_=>{
		this.afService.getAllData("users/"+this.userId+"/posts/"+postId+"/postDetails/like").
		subscribe(snapshots => {
			this.af.database.object("allPosts/"+this.userId+"/"+postId+"/like").set( snapshots.length)
			});
			dom.target.classList.add("likedDisliked");
		});
}
dislikedThepost(postId: string, dom: any){
	this.af.database.object("users/"+this.userId+"/posts/"+postId+"/postDetails/disLike/"+this.userId).set(1)
	.then(_=>{
		this.afService.getAllData("users/"+this.userId+"/posts/"+postId+"/postDetails/disLike").
		subscribe(snapshots => {
			this.af.database.object("allPosts/"+this.userId+"/"+postId+"/disLike").set( snapshots.length)
			});
			dom.target.classList.add("likedDisliked");
		});
		
}
gotoPost(authorId: string,postId: string){
	this.storage.store("authorId",authorId);
	this.storage.store("postId",postId);
	this.router.navigate(['post']);	
}
getLikesCount(counter: any) {if(counter)return Object.keys(counter).length; else return 0;}

}