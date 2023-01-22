import { Directive, HostListener } from '@angular/core';


@Directive({
  selector: '[app-event-blocker]'
})
//this directive will prevent the browser from executing the default behavior of whatever has it, if the user drags and drops a file
export class EventBlockerDirective {

  //we decorate the function with a pair of HostListener decorators which gives us access to the element that invokes it, while listening
  //for an event (which in this case is 'drop' and 'dragover') and getting us the args from the element (which we specify in the second parameter)
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

}
