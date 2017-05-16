import { Component} from '@angular/core';
import {AF} from "../providers/af";
import {Router} from "@angular/router";
import { LocalStorageService} from 'ng2-webstorage';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFire} from 'angularfire2';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['../user-dashboard/user-dashboard.component.css','./search-result.component.css']
})
export class SearchResultComponent  {
  
 private basicDetails: Object;
 private dataAvailable: boolean=false;
 private defaultAvatar: string= "src/app/img/Default-avatar.jpg";
 private posts: Array<any>=[];
 private profilePics: string;
 private allPosts: Array<Object>;
 private searchId: string="";
  constructor(public afService: AF, private router: Router, 
  private storage: LocalStorageService ) {
  this.searchId=this.storage.retrieve("searchId"); 
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
 this.afService.getAllData("users/"+this.searchId).subscribe(snapshots => {
			this.dataAvailable=true;
			this.basicDetails=snapshots[1];
			this.profilePics=snapshots[0].$value;
	});
	 this.afService.getAllData("allPosts/"+this.searchId).subscribe(snapshots => {
		this.posts= snapshots;
		console.log(snapshots);
	 });

}

gotoPost(authorId: string,postId: string){
	this.storage.store("authorId",authorId);
	this.storage.store("postId",postId);
	this.router.navigate(['post']);	
}
getLikesCount(counter: any) {if(counter)return Object.keys(counter).length}
}
