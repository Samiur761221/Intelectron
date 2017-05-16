// src/app/providers/af.ts
import {Injectable,Input} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods,FirebaseListObservable,FirebaseApp } from 'angularfire2';
import {LocalStorageService} from 'ng2-webstorage';
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
//

//declare var firebase: any;

interface Image {
    path: string;
    filename: string;
    downloadURL?: string;
    $key?: string;
}
@Injectable()
export class AF {
	@Input() folder: string;
    fileList : FirebaseListObservable<Image[]>;
    imageList : Observable<Image[]>;
	
	private textInput: string="";
	private possible: string;
	public ajaxStart: boolean=true;
	private profoleAvatar: string="";
	private userName: string="";
	
  constructor(public af: AngularFire,private storage: LocalStorageService, private router: Router) {}
  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
  loginWithGoogle() {
    return this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    });
  }
  loginWithFacebook() {
    return this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
    });
  }
  logInwithcredential(user:any){
    return this.af.auth.login(user,{
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    });
  } 
 sendVerficationEmail(){
	 return this.af.auth.getAuth().auth.sendEmailVerification();
 }
  /**
   * Logs out the current user
   */
  logout() {
	this.storage.clear();
    return this.af.auth.logout();
  }
   createUser(email: string, password: string) {
  return this.af.auth.createUser({ email: email, password: password });
}
 getAllData(uid: any){
	 console.log(uid);
	 return this.af.database.list(uid);
    }
	
	 uploadFile(fileId) {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        let success = false;
        // This currently only grabs item 0, TODO refactor it to grab them all
        for (let selectedFile of [(<HTMLInputElement>document.getElementById(fileId)).files[0]]) {
            console.log(selectedFile);
            // Make local copies of services because "this" will be clobbered
            let router = this.router;
            let af = this.af;
            let folder = this.folder;
            let path = 'photoGallery/'+this.makeid()+selectedFile.name;
            var iRef = storageRef.child(path);
			let userId=this.storage.retrieve("userId");
           return iRef.put(selectedFile);/*.then((snapshot) => {
				console.log(snapshot.downloadURL)
				af.database.object("users/"+userId+"/basicDetails/profilePics").set(snapshot.downloadURL);
            });*/
        }
        
    }
	 delete(image: Image) {
        let storagePath = image.path;
        let referencePath = `${this.folder}/images/` + image.$key;

        // Do these as two separate steps so you can still try delete ref if file no longer exists

        // Delete from Storage
        firebase.storage().ref().child(storagePath).delete()
        .then(
            () => {},
            (error) => console.error("Error deleting stored file",storagePath)
        );

        // Delete references
        this.af.database.object(referencePath).remove()
            
        

    }
 makeid()
	{
		this.possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < 5; i++ )
			this.textInput += this.possible.charAt(Math.floor(Math.random() * this.possible.length));

		return this.textInput;
	}
getDatetime() {
  let d=new Date();
  let day=d.getDate();
  let month=d.getMonth();
  let year=d.getFullYear();
  let hour=d.getHours();
  let mins=d.getMinutes();
  let secs=d.getSeconds();
  let monthList=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  let min = mins < 10 ? '0'+mins : mins;
  let sec = secs < 10 ? '0'+secs : secs;
  let strTime = hour + ':' + min + ':'+sec+' ' + ampm;
  let strDate=day+'-'+monthList[month]+'-'+year+' '
	
  return (strDate+strTime);
}
getAvatar(user: string): string{
	 this.af.database.object("users/"+user+"/avatar").subscribe(data=>{
		this.profoleAvatar=data.$value;
	});
	 return this.profoleAvatar;
}
getUserName(user: string): string{
	 this.af.database.object("users/"+user+"/basicDetails/name").subscribe(data=>{
		this.userName=data.$value;
	});
	 return this.userName;
}

}
