import { observable, action } from 'mobx';

export class SidebarState {
  @observable
  open: boolean = true;

  @action 
  toggle(): void {
    this.open = !this.open; 
    console.log(this.open);
  }
}