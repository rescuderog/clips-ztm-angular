import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { v4 as uuid } from 'uuid';
import CustomAlert from 'src/app/models/alert.model';
import { last, switchMap } from 'rxjs/operators';
import { ClipService } from 'src/app/services/clip.service';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  //property for handling the style change when a file is dragged over, triggered by some events on the div
  isDragover: boolean = false;
  //property for handling the visibility of a part of the form (title and thumbnails)
  nextStep: boolean = false;
  //property for storing the file that the user uploaded
  file: File | null = null;
  //property for storing the percentage of the upload and hiding/showing it on the alert component
  percentage: number = 0;
  showPercentage = false;
  //property for storing the user data to upload to the db
  user: firebase.User | null = null
  //task property for storing the upload task so we can manage it from the whole class and not only from the upload function
  task?: AngularFireUploadTask

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
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    //we subscribe to the user observable and get the user object to our user property 
    auth.user.subscribe(user => {
      this.user = user
    });
    //we're initializing FFmpeg as early as possible due to the size of the package
    this.ffmpegService.init();
  }

  //function for handling the event when a file is dropped onto the div and file storage
  storeFile($event: Event) {
    this.isDragover = false;

    //if the dropbox element was used, we access the dataTransfer property of the DragEvent object to retrieve the file
    //we use the nullish coalescing operator to catch a possibly undefined value and turn it into null
    //if the fallback (normal input) was used, we access the file via the target object
    this.file = ($event as DragEvent).dataTransfer ? 
                ($event as DragEvent).dataTransfer?.files.item(0) ?? null : 
                ($event.target as HTMLInputElement).files?.item(0) ?? null;
    
    //checking if the file is not empty and if the file is an mp4 file (we check the MIME type), so we can exit the function
    //if any of those occur
    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }
    
    //we preset the title value of the form with the name of the video uploaded
    this.videoTitle.setValue(this.file.name.replace('.mp4', ''));

    //we enable the form to let the user put the title to the video and select the thumbnail
    this.nextStep = true;
  }

  //function that gets executed when the user submits the form
  submitVideo() {
    //we disable the form to prevent them to change the data while we're uploading the clip
    this.videoForm.disable();
    const clipFileName: string = uuid();
    
    //we create a path using the uuid package to get a unique name
    const clipPath = `clips/${clipFileName}.mp4`;
    
    //we finally upload to firebase and update the alert component accordingly
    this.alertObj.setAlertNormal('Please wait while the file uploads.', true);
    this.showPercentage = true;
    
    this.task = this.storage.upload(clipPath, this.file);
    //we create a reference to the file we're about to upload to access the public url of it
    const clipRef = this.storage.ref(clipPath);

    //we subscribe to the percentageChanges observable to get a realtime update on the percentage of the file uploaded
    this.task.percentageChanges().subscribe((progress) => {
        this.percentage = progress as number / 100;
    });

    //we subscribe to the snapshotChanges to track the state of the upload and set the alert properly to success or error
    this.task.snapshotChanges().pipe(
      //we use the last operator so we only get the last push of the observable before it completes (which is either a success or error message)
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        //object created to get all the info together to create a db entry for the clip
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.videoTitle.value,
          fileName: `${clipFileName}.mp4`,
          url: url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        //we upload the metadata to firestore via the clipsService and receive the promise with the id
        //of the document in which the metadata is stored
        const clipDocRef = await this.clipsService.createClip(clip)

        this.alertObj.setAlertSuccess('File uploaded successfully!', true);
        this.showPercentage = false;

        //we wait a second and redirect the user to the clip url
        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ])
        }, 1000);
      },
      error: (error) => {
        this.alertObj.setAlertError('There was an error during the file upload. Please try again');
        this.showPercentage = false;
        //we enable the form to let the user resubmit it
        this.videoForm.enable();
      }
    })
    
  }

  //destructor function, we'll do some cleanup related to the uploads if the user exits the component before the upload finalizes
  ngOnDestroy(): void {
    this.task?.cancel();
  }
}
