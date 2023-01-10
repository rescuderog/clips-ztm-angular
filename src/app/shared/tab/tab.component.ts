import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent {
  //the tab title as an input so we can pass it from the html template of the modal
  @Input() tabTitle: string = ''
  @Input() active: boolean = false
}
