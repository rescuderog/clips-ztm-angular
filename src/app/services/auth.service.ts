import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import IUser from '../models/user.model';
import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

//service to manage the login behind authentication and db access related to that using Firebase
export class AuthService {

  //firestore service, adding the additional data, sans the password. We use the generic to indicate we're sending IUser data. Here we only declare the property and type
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  //this property keeps track of whether the page the user is currently in requires login or not.
  private redirect: boolean = false;

  constructor(    
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    //router class, to manage the redirects
    private router: Router,
    //provides access to info related with a route. i.e. its data object
    private route: ActivatedRoute
    ) { 
    //we initialize the collection with the service
    this.usersCollection = db.collection('users')
    //we pipe the user observable through the map function to convert the value to a boolean. if it's null, the user isn't authenticated, so we return false
    this.isAuthenticated$ = auth.user.pipe(
      map((object) => {
        return object == null ? false : true;
      })
    );
    //second pipe to add a fake delay to the previous observable so the transition isn't so abrupt
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );
    //we subscribe to this object and listen for the events emitted by the routing system (everytime it produces changes)
    //in this case, because we only care about when the navigation ended (to get the latest data from the route)
    //we filter it so it will only subscribe to objects that are of the NavigationEnd class
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      //we're not interested in the event anymore here. we just checked if the navigation ended so we could be sure it wouldn't have unexpected behaviour when grabbing the data
      //now we actually grab the data from the route. We are now using the ActivatedRoute service, which stores all the values associated with the route the user is currently on.
      map(e => this.route.firstChild),
      //the ActivatedRoute service returns a ActivatedRoute object, from which we're only interested in its data observable, so we subscribe to that via the switchMap operator.
      //route.firstChild can return both an Observable or just null. For that, we account for it via the coalescing operator ('??') so we can return a new empty Observable 
      //if that's the case.
      switchMap(route => route?.data ?? of({}))
    ).subscribe((data) => {
      this.redirect = data['authOnly'] ?? false
    })
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
  //it was moved to the auth service to better modularize and serve the code

  public async logout ($event?: Event) {
    if($event) {
      $event.preventDefault();
    }
    
    //we use the AngularFireAuth service to handle logout and cleanup the token
    await this.auth.signOut();

    //finally, we redirect the user back to the home page if the redirect property is true
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
