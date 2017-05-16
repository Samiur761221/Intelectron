import { Component, Input } from '@angular/core';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms"
import { LocalStorageService} from 'ng2-webstorage';
import { Observable } from 'rxjs';

declare var firebase: any;

interface Image {
    path: string;
    filename: string;
    downloadURL?: string;
    $key?: string;
}


@Component({
  selector: 'app-basic-details-form',
  templateUrl: './basic-details-form.component.html',
  styleUrls: ['./basic-details-form.component.css']
})
export class BasicDetailsFormComponent   {
	
	@Input() folder: string;
    fileList : FirebaseListObservable<Image[]>;
    imageList : Observable<Image[]>;
	
  constructor(public afService: AngularFire, private router: Router,
  public store: LocalStorageService) { }

  basicDetailsSubmit(formData:any) {
	   let userId=this.store.retrieve("userId");
	  let userData: Object={"basicDetails":formData,"avatar":"","posts":""}
	  let dataPacket: Object={};
	  dataPacket[userId]=userData;
	 this.afService.database.object('userMap/'+userId).set(formData.name);
	 this.afService.database.object('/users/'+userId).set(userData).then(_ => {this.router.navigate(['profile']);});
	  console.log(this.store.retrieve("userId"));
  }
 

    upload() {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        let success = false;
        // This currently only grabs item 0, TODO refactor it to grab them all
        for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {
            console.log(selectedFile);
            // Make local copies of services because "this" will be clobbered
            let router = this.router;
            let af = this.afService;
            let folder = this.folder;
            let path = 'avatar/'+selectedFile.name;
            var iRef = storageRef.child(path);
			let userId=this.store.retrieve("userId");
            iRef.put(selectedFile).then((snapshot) => {
				console.log(snapshot.downloadURL)
				af.database.object("users/"+userId+"/basicDetails/profilePics").set(snapshot.downloadURL);
            });
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
        this.afService.database.object(referencePath).remove()
            
        

    }

}
