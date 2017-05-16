import { Component, Input , ViewChild,ElementRef} from '@angular/core';
import { AF } from "./providers/af";
import { Router } from "@angular/router";
import {LocalStorageService} from 'ng2-webstorage';

import {NgbModal, NgbActiveModal,NgbDatepickerConfig, NgbDateStruct,NgbDateParserFormatter,NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  public isLoggedIn: boolean;
  public ajaxStart: boolean=false;
  public model: any;
  private formatter: any;
  private search: any;
  private userList: Array<any>=[];
  private userDetails: any;
  userId:string;
  onlineUserList: Array<any>=[];
  isCollapsed: boolean=true;
  private userIds: Array<string>=[];
  private recieverDetails: Object={};
  chatStarted:boolean=false;
  recieverId: string;
  autoplay:boolean=false;
  //private tabset:NgbTabset;

  @ViewChild('tabs')  public tabset: NgbTabset;
   @ViewChild('chatBarContainer')  public chatContainer: ElementRef;
    @ViewChild('msgAudio') player;
  allMsgs: Array<any>=[];

  constructor(public afService: AF, private router: Router, public storage: LocalStorageService,
  private session: LocalStorageService,  private modalService:NgbModal, private config: NgbDatepickerConfig,
   private dateFormatter:NgbDateParserFormatter) {
     // setTimeout(()=>{ console.log(this.tabset) }, 10000)
     this.config.minDate = {year: 1900, month: 1, day: 1};
  this.config.maxDate = {year: 1999, month: 12, day: 31};
  this.dateFormatter.format=(date: NgbDateStruct) => {
	  if(date)
		return date.day+"-"+(date.month)+"-"+date.year
	else
		return "";
	  };
    this.afService.af.auth.subscribe(
      (data) => {
      if(data == null) {
          this.isLoggedIn = false;
          this.router.navigate(['Login']);
        }
      else if(data.auth.emailVerified ||data.auth.providerData[0].providerId.match('facebook')) {
			const uid=data.auth.uid;
			this.storage.store("userId",uid);
      this.userId=uid;
			this.isLoggedIn = true;
      this.afService.af.database.object("loginStatus/"+uid).set("online");
        }
		else{
		const modalRef = this.modalService.open(NgbdModalContent);
		modalRef.componentInstance.name = 'Please verify your email';
		}
		
      });
	   this.afService.getAllData("userMap").subscribe(userLists=>{
		   for(let entry of userLists){
			   this.userDetails={
				   'name':entry.$value,
				   'userId':entry.$key,
			   }
			    this.userList.push(this.userDetails);
		   }		
	});
	this.formatter =  (x: {name: string}) => x.name;
	this.search = (text$: Observable<string>) =>
	text$
	.debounceTime(10)
	.map(term => term === '' ? []
	:this.userList.filter(v => new RegExp(term, 'gi').test(v.name)).slice(0, 10));

	this.afService.getAllData("loginStatus").subscribe(loginStatus=>{
		this.onlineUserList=[];
		 for(let entry of loginStatus){
    if(entry.$value=='online' && entry.$key !=this.userId){
			this.afService.getAllData("users/"+entry.$key).subscribe(snapshot=>{
				 let basicDetails=snapshot[1];
				 let userDetails={
				   "avatar":snapshot[0].$value,
				   "name":basicDetails.name,
				   "city":basicDetails.city,
				   "state":basicDetails.state,
				   'userId':entry.$key,
			   }
			   this.onlineUserList.push(userDetails);
			});
		}
	}
	//	console.log(this.onlineUserList);
	});

	this.afService.af.database.object("checkRequest/"+this.storage.retrieve("userId")).subscribe((data)=>{
	if(data.$value)
	{
    this.afService.af.database.list('checkRequest').remove(this.storage.retrieve("userId"));
	this.afService.af.database.object("userMap/"+data.$value).subscribe((name)=>{
		this.afService.af.database.object("userMap/"+this.storage.retrieve("userId")).subscribe((output)=>{
	    const modalRef = this.modalService.open(chatRequestNotification);
		modalRef.componentInstance.sender = 'Do you want to chat with '+name.$value;
		modalRef.componentInstance.reciever=output.$value;
    modalRef.componentInstance.recieverId=this.userId;
    modalRef.componentInstance.senderId=data.$value;	
	});		
	});

	}
});
this.afService.af.database.object("chatStarted/"+this.storage.retrieve("userId")).subscribe((data)=>{
if(data.$value){
       this.chatRequest(data.$value);
       this.afService.af.database.list('chatStarted').remove(this.storage.retrieve("userId"));
    }
});

  }



  logout() {
    this.afService.af.database.object("loginStatus/"+this.storage.retrieve("userId")).set("offline");
    this.afService.logout();
	  this.router.navigate(['Login']);
  }
  getProfilePics(userId: string){return this.afService.getAvatar(userId)};
  goToSearchResult(data: any){
	  this.session.store("searchId",data.userId);
	  this.router.navigate(['searchResult']);
	 }
    chatRequest(userId: any){
      this.userIds=[userId,this.userId];
      this.userIds.sort();
      this.recieverId=userId;
      this.afService.af.database.object('messageChannel/'+this.userIds.join("-")).subscribe((data)=>{
      if(data[userId]){
        this.afService.getAllData("users/"+userId).subscribe(snapshot=>{
				 let basicDetails=snapshot[1];
				 this.recieverDetails={
				   "avatar":snapshot[0].$value,
				   "name":basicDetails.name,
				   "city":basicDetails.city,
				   "state":basicDetails.state,
			   }
			});
         this.allMsgs=[];
        for(var entry in data){
          if(typeof data[entry] !="string"){
           let msg=[];
           let localData=data[entry]
            for(var entrykey in localData){
              msg.push(localData[entrykey])
            }
             let dataObject={
              "date":entry,
              "msgArray":msg
            };
            this.allMsgs.push(dataObject);
          }
		   }
         if(this.tabset.activeId=='chatBarTag' && this.allMsgs.length){
           let lastArray=this.allMsgs[this.allMsgs.length-  1].msgArray;
           this.autoplay=lastArray[lastArray.length-1].userId !=this.userId;
           if(this.autoplay)
              this.player.nativeElement.play()
           
           
         }
          //this.autoplay=this.allMsgs[this.allMsgs.length-  1].msgArray[this.allMsgs[this.allMsgs.length-  1].msgArray.length-1]!=this.userId;
         this.tabset.select('chatBarTag') ;
         this.chatStarted=true;
         if(this.chatContainer){
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
         }
     
               
        }
        else
        this.afService.af.database.object("checkRequest/"+userId).set(this.userId)
      });
	}
  postMessage(event){
if(event.keyCode == 13) {
  let datapack={
    "message":event.target.value,
    "dateTime":this.afService.getDatetime(),
    "userId":this.userId
  } /**/
  this.afService.af.database.list('messageChannel/'+this.userIds.join("-")+'/'+this.afService.getDatetime().split(" ")[0]).push(datapack).then(data=>{
    this.afService.af.database.object("chatStarted/"+this.recieverId).set(this.userId);
		event.target.value="";
	});
  //console.log(this.userIds)
    //console.log(event.target.value)
  }

  }
}

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click');afService.logout();router.navigate(['Login']);">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p> {{name}}!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click');afService.logout();router.navigate(['Login']);">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name;
  constructor(public activeModal: NgbActiveModal,public afService: AF,private router: Router) {}
}


@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" >Hi {{reciever}}!</h4>
      <button type="button" class="close" aria-label="Close" (click)="rejectRequest()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p > {{sender}}!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="startChat()">Yes</button>
	  <button type="button" class="btn btn-secondary" (click)="rejectRequest()">No</button>
    </div>
    <input hidden type="text" [ngModel]="recieverId" name="recieverId"/>
    <input hidden type="text" [ngModel]="senderId" name="senderId"/>
  `
})
export class chatRequestNotification {
  @Input() sender;@Input() reciever; senderId;@Input() recieverId;
  private userIds: Array<string>=[];
  constructor(public activeModal: NgbActiveModal,public afService: AF,private router: Router, private app:AppComponent) {
  
  }
  
  startChat(){
      this.userIds=[this.senderId,this.recieverId];
    this.userIds.sort();
 // console.log(this.userIds)
  this.afService.af.database.object('messageChannel/'+this.userIds.join("-")+'/'+this.recieverId).set("acknowledged");
  this.afService.af.database.object('messageChannel/'+this.userIds.join("-")+'/'+this.senderId).set("acknowledged");
	this.activeModal.dismiss('Accepted');
this.afService.af.database.object("chatStarted/"+this.recieverId).set(this.senderId);
 // this.app.chatRequest(this.recieverId)
  }
  rejectRequest(){
    //console.log(this.recieverId);
	  this.activeModal.dismiss('Reject');
  }
}