import { observable } from 'mobx';
import { SidebarState } from './components/Sidebar/Sidebar.state';
import { PagelistState } from './components/Pagelist/Pagelist.state';

export class AppState {
  @observable
  sidebar = new SidebarState();

  @observable
  pagelist = new PagelistState()
}