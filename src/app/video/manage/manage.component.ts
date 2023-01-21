import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder: string = '1';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    //we subscribe to the queryParams observable from the ActivatedRoute service, so we can track the
    //changes on the query parameter
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === 2 ? params['sort'] : '1'
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
}
