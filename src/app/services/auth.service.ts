import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import IUser from '../models/user.model';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

//service to manage the login behind authentication and db access related to that using Firebase
export class AuthService {

  //firestore service, adding the additional data, sans the password. We use the generic to indicate we're sending IUser data. Here we only declare the property and type
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(    
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
    ) { 
    //we initialize the collection with the service
    this.usersCollection = db.collection('users')
    //we pipe the user observable through the map function to convert the value to a boolean. if it's null, the user isn't authenticated, so we return false
    this.isAuthenticated$ = auth.user.pipe(
      map((object) => {
        return object == null ? false : true;
      })
    );
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );
  }

  public async createUser(userData: IUser) {
    if(!userData.password) {
      throw new Error("Password not provided!!");
    }
    //we talk with firebase, trying to create a user with email and password. we do that in async mode
    //auth service, it also returns the token if succesful and automatically stores it
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    );

    //we check if we got a valid user credential, otherwise we throw an error
    if(!userCred.user) {
      throw new Error("Credentials not provided!!");
    }
    
    //we finally send the data to the collection using the user's UID on auth as the document's ID
    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    });

    //we change the display name on the profile
    await userCred.user.updateProfile({
      displayName: userData.name
    });
  }

  //catches the event on logout and prevents default behavior, then logs out the user

  public async logout ($event?: Event) {
    if($event) {
      $event.preventDefault();
    }
      
    await this.auth.signOut();
    //finally, we redirect the user back to the home page
    await this.router.navigateByUrl('/');
  }
}
