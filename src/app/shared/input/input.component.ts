import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  //we create a form control to receive the values passed down by the form
  @Input() control: FormControl = new FormControl();
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() format: string = ''
}
