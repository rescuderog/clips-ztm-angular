import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { IClip } from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  //we apply the collection type  with the custom interface IClip to enforce the type of data expected for the db and prevent mismatches
  public clipsCollection: AngularFirestoreCollection<IClip>

  constructor(
    private db: AngularFirestore
  ) {
    //we select the collection ("table") on the firestore db
    this.clipsCollection = db.collection('clips')
  }
  
  //function for adding the clip metadata to the db, returns a promise that's a reference
  //to the document formatted in the IClip format
  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data)
  }
}
