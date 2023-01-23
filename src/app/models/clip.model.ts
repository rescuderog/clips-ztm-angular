import firebase from 'firebase/compat/app'

//custom interface to enforce the elements in the clip object to send to the database
export interface IClip {
    docID?: string;
    uid: string;
    displayName: string;
    title: string;
    fileName: string;
    url: string;
    //type of the return value of the serverTimestamp method from firebase
    timestamp: firebase.firestore.FieldValue;
}