import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  id: string = ''
  constructor(
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    //subscribing to the params observable to get real-time info on the route parameter 'id'
    //then, passing it to the this.id element so it can update the page title dynamically
    this.route.params.subscribe((params: Params) => {
      this.id = params['id']
    });
  }
}
