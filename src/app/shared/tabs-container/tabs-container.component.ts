import { Component, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {
  //we get the tabs element we projected to the container via the ContentChildren decorator
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList();

  //after the projected content is on the component we check for tabs with the active element set to true
  //if there aren't any tabs with that element as true, we set the first one
  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter(
      tab => tab.active
    );

    if(!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  //this function handles the setting of the active value of a tab element. it is used both
  //on this class to set the first element if no elements are set by default and
  //by the templates to set the tabs on a click event

  selectTab(tab: TabComponent) {
    this.tabs.forEach(tab => {
      tab.active = false
    });
    tab.active = true;
    return false;
  }
}
