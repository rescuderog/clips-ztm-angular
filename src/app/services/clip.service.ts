import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { IClip } from '../models/clip.model';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { __values } from 'tslib';


@Injectable({
  providedIn: 'root'
})
export class ClipService {
  //we apply the collection type  with the custom interface IClip to enforce the type of data expected for the db and prevent mismatches
  public clipsCollection: AngularFirestoreCollection<IClip>

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    //we select the collection ("table") on the firestore db
    this.clipsCollection = db.collection('clips')
  }
  
  //function for adding the clip metadata to the db, returns a promise that's a reference
  //to the document formatted in the IClip format
  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  //we'll perform a query to get the user clips related to its id
  getUserClips(sort$: BehaviorSubject<string>) {
    //we subscribe to two observables through the combineLatest function, and whenever anyone of the two
    //pushes something, the whole pipeline gets executed
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap(values => {
        const [user, sort] = values

        //we check if the user observable is not null
        if(!user) {
          return of([])
        }

        //we make a query to firebase to get a list of user's clips
        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp', 
          sort === '1' ? 'desc' : 'asc'
        );

        return query.get();
      }),
      //we apply the map function so it doesn't return the whole query object and we only return the relevant part
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  //function for updating the clip title via id. Returns a promise
  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title: title
    })
  }

  //function for updating the clip on the backend. TODO: error handling
  async deleteClip(clip: IClip) {
    //we create a reference to the clip on the storage, so we can delete it directly
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);

    await clipRef.delete();

    //we now delete the element from the collection on Firestore db
    await this.clipsCollection.doc(clip.docID).delete();

  }
}
