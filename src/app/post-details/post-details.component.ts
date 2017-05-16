import { Component, Pipe} from '@angular/core';
import {AF} from "../providers/af";
import {Router} from "@angular/router";
import { LocalStorageService} from 'ng2-webstorage';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFire} from 'angularfire2';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['../user-dashboard/user-dashboard.component.css','./post-details.component.css']
})
export class PostDetailsComponent  {
  private authorId: string;
  private postId: string;
  private basicDetails: Object={};
  private defaultAvatar: string= "src/app/img/Default-avatar.jpg";
  private profilePics: string;
  private allPosts: Array<Object>;
  public postDetails: Object={};
  private postImage: string;
  private likeCounter: number=0;
  private disLikeCounter: number=0;
  private liked: boolean=false;
  private disLiked: boolean=false;
  private userId: string;
  private comments: Array<Object>=[];
  private resetComent: string="";
  constructor(public afService: AF, private router: Router, 
  private storage: LocalStorageService, private modalService:NgbModal,
  private af: AngularFire) {
	this.authorId=this.storage.retrieve("authorId");
	this.postId=this.storage.retrieve("postId");
	this.userId=this.storage.retrieve("userId");
	console.log(this.authorId);
	this.afService.getAllData("users/"+this.authorId).
	subscribe(snapshots => {
		this.basicDetails=snapshots[1];
		this.profilePics=snapshots[0].$value;
	});
	this.afService.getAllData("users/"+this.authorId+"/posts/"+this.postId).
	subscribe(snapshots => {
		this.postDetails=snapshots[0];
		if(snapshots[1])
			this.postImage=snapshots[1].$value;
		if(this.postDetails["like"][this.userId])
			this.liked=true;
		if(this.postDetails["disLike"][this.userId])
			this.disLiked=true;		
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
this.afService.getAllData("users/"+this.authorId+"/posts/"+this.postId+"/postDetails/like").
	subscribe(snapshots => {
		this.likeCounter=snapshots.length;
		this.af.database.object("allPosts/"+this.authorId+"/"+this.postId+"/like").set(this.likeCounter)
		console.log(snapshots);
	});
this.afService.getAllData("users/"+this.authorId+"/posts/"+this.postId+"/postDetails/disLike").
	subscribe(snapshots => {
		this.disLikeCounter=snapshots.length;
		this.af.database.object("allPosts/"+this.authorId+"/"+this.postId+"/disLike").set(this.disLikeCounter)
	});
	
	
	this.afService.getAllData("users/"+this.authorId+"/posts/"+this.postId+"/postDetails/comments").
	subscribe(snapshots => {this.comments=snapshots;});
  }
  gotoPost(authorId: string,postId: string){
	this.storage.store("authorId",authorId);
	this.storage.store("postId",postId);
	location.reload();
}
likedThepost(dom: any){
	this.af.database.object("users/"+this.authorId+"/posts/"+this.postId+"/postDetails/like/"+this.userId).set(1)
	.then(_=>{
		this.afService.getAllData("users/"+this.authorId+"/posts/"+this.postId+"/postDetails/like").
		subscribe(snapshots => {
			this.af.database.object("allPosts/"+this.authorId+"/"+this.postId+"/like").set( snapshots.length)
			});
			dom.target.classList.add("likedDisliked");
		});
}
 dislikedThepost(dom:any){
	this.af.database.object("users/"+this.authorId+"/posts/"+this.postId+"/postDetails/disLike/"+this.userId).set(1)
	.then(_=>{
		this.afService.getAllData("users/"+this.authorId+"/posts/"+this.postId+"/postDetails/disLike").
		subscribe(snapshots => {
			this.af.database.object("allPosts/"+this.authorId+"/"+this.postId+"/disLike").set( snapshots.length)
			});
			dom.target.classList.add("likedDisliked");
		});
		
}
submitComment(data: any){
	data.author=this.userId;
	data.dateTime=this.afService.getDatetime();
	this.af.database.list("users/"+this.authorId+"/posts/"+this.postId+"/postDetails/comments").push(data).then(data=>{
		this.resetComent="";
	});
}
getProfilePics(user: string){return this.afService.getAvatar(user);}
getAuthor(user: string){return this.afService.getUserName(user);}

}
