import { Component, Input, OnChanges, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { IClip } from 'src/app/models/clip.model';
import CustomAlert from 'src/app/models/alert.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  //property created so we can pass down data from the clip to the modal
  @Input() activeClip: IClip | null = null; 
  //output decorated property to pass up data from the changes made to the parent component
  @Output() update = new EventEmitter();

  //we create a FormGroup and FormControls for the form containing the title of the video we're editing
  clipID = new FormControl<string>('', {
    nonNullable: true
  });
  title = new FormControl<string>('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });

  clipEditForm = new FormGroup({
    videoTitle: this.title,
    id: this.clipID
  });

  //object for storing and interfacing with the alert system
  alertObj = new CustomAlert();

  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) {}

  //we register and destroy our modal with the modal component
  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnChanges(): void {
    //we check if the activeClip property is empty so we avoid updating the form controls with this
    if(!this.activeClip) {
      return
    }

    this.clipID.setValue(this.activeClip.docID as string);
    this.title.setValue(this.activeClip.title);

    //we also set off the showAlert in order to not confuse the user when editing multiple clips
    this.alertObj.setShowAlert(false);
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  //function called by the ngSubmit event to handle the form submission
  async submit() {
    //checking if the activeClip property is empty first
    if(!this.activeClip) {
      return
    }

    this.alertObj.setAlertNormal('Please wait, updating changes...', true);

    try {
      //we invoke the updateClip function to handle the backend stuff with the data from the form
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch(e) {
      this.alertObj.setAlertError('An error has occurred, try again.');
      return
    }

    //updating the title to its new value
    this.activeClip.title = this.title.value;

    //we send back the active clip property so the parent component can update whatever it needs on its part
    this.update.emit(this.activeClip);
    
    this.alertObj.setAlertSuccess('Success! The changes have been applied.');
    
  }
}
