import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import CustomAlert from 'src/app/models/alert.model';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  //property for handling the style change when a file is dragged over, triggered by some events on the div
  isDragover: boolean = false;
  //property for handling the visibility of a part of the form (title and thumbnails)
  nextStep: boolean = false;
  //property for storing the file that the user uploaded
  file: File | null = null;
  //property for storing the percentage of the upload
  percentage: number = 0;
  showPercentage = false;

  //we create a FormGroup and FormControls for the ensuing form containing the selection of the thumbnail and title of the video
  videoTitle = new FormControl<string>('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });

  videoForm = new FormGroup({
    videoTitle: this.videoTitle
  });

  //alert object to show the upload status
  alertObj = new CustomAlert();

  constructor(
    private storage: AngularFireStorage
  ) { }

  //function for handling the event when a file is dropped onto the div and file storage
  storeFile($event: Event) {
    this.isDragover = false;

    //we access the dataTransfer property of the DragEvent object to retrieve the file
    //we use the nullish coalescing operator to catch a possibly undefined value and turn it into null
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;
    
    //checking if the file is not empty and if the file is an mp4 file (we check the MIME type), so we can exit the function
    //if any of those occur
    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }
    
    //we preset the title value of the form with the name of the video uploaded
    this.videoTitle.setValue(this.file.name.replace('.mp4', ''));

    this.nextStep = true;
  }

  

  //function that gets executed when the user submits the form
  submitVideo() {
    const clipFileName: string = uuid();
    
    //we create a path using the uuid package to get a unique name
    const clipPath = `clips/${clipFileName}.mp4`;
    
    //we finally upload to firebase and update the alert component accordingly
    this.alertObj.setAlertNormal('Please wait while the file uploads.', true);
    this.showPercentage = true;
    
    const task = this.storage.upload(clipPath, this.file);
    //we subscribe to the percentageChanges observable to get a realtime update on the percentage of the file uploaded
    task.percentageChanges().subscribe((progress) => {
        this.percentage = progress as number / 100;
    });

    //we subscribe to the snapshotChanges to track the state of the upload
    task.snapshotChanges().pipe(
      last()
    ).subscribe({
      next: (snapshot) => {
        this.alertObj.setAlertSuccess('File uploaded successfully!', true);
        this.showPercentage = false;
      },
      error: (error) => {
        this.alertObj.setAlertError('There was an error during the file upload. Please try again');
        this.showPercentage = false;
      }
    })
    
  }
}
