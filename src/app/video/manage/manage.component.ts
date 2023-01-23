import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import { IClip } from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  //this property defines the ordering of the video. It is toggled by the select on the page
  videoOrder: string = '1';
  //array of IClip objects to store clips metadata
  clips: IClip[] = []
  activeClip: IClip | null = null;
  //creating an BehaviorSubject observable to help in sorting
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    //we subscribe to the queryParams observable from the ActivatedRoute service, so we can track the
    //changes on the query parameter
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
      this.sort$.next(this.videoOrder);
    });
    //we subscribe to the observable to get an array of user clips and we store it in the clips property
    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = [];
      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    });
  }

  sort(event: Event) {
    //we explicitly tell TS and Angular that the event is from a Select Element
    //thus, with this assertion we comply with a TS type safety warning
    const { value } = (event.target as HTMLSelectElement)

    //we pass via a query parameter the value of the sort select and we navigate
    //to the url (same component, just different sorting in this case)
    this.router.navigate([], {
      //we change the default behavior of the navigate method (absolute path) to
      //relative path via this element in the extras parameter, we pass an ActivatedRoute
      //instance so it has the relative route
      relativeTo: this.route,
      //we pass the query parameters via a key:value system on the queryParams element
      queryParams: {
        sort: value
      }
    })
  }

  //method called by the edit button of the template (on each video) which passes the data of the clip
  //so it can be passed to the modal
  openModal($event: Event, clip: IClip) {
    $event.preventDefault();

    //setting the active clip to the clip to pass down data to the modal
    this.activeClip = clip;

    this.modal.toggleModal("editClip");
  }

  //method for updating the title of a clip when it has been modified, with info passed up from the edit component
  update($event: IClip) {
    this.clips.forEach((element, index) => {
      if(element.docID == $event.docID) {
        this.clips[index].title = $event.title;
      }
    })
  }

  //method called by the delete button of the template which passes the data of the clip to delete
  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this.clipService.deleteClip(clip)

    this.clips.forEach((element, index) => {
      if(element.docID == clip.docID) {
        this.clips.splice(index, 1);
      }
    })
  }
}
