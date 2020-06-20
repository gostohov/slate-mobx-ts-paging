import * as React from 'react';
import { observable, action, computed } from 'mobx';
import { Page } from './Page/Page';
import { PageState } from './Page/Page.state';

export interface IPage {
  id: number,
  state: PageState
};

export class PagelistState {
  @observable
  pagelist: IPage[] = [
    { id: 1, state: new PageState(this, { id: 1 }) }
  ];

  @action 
  addPage(id: number): void {
    const page = { id, state: new PageState(this, { id }) };
    this.pagelist.splice(id, 0, page);
    this.focusPageById(id);
  }

  @computed
  get pageElementList(): JSX.Element[] {
    return this.pagelist.map(({ id, state }) => <Page key={`page-${id}`} state={state}/>);
  }

  @action
  focusPageById(id: number): void {
    const page = this.pagelist.find(p => p.id === id);
    if (page) page.state.focus = true;
  }

  @action
  overflowHandle(id: number): void {
    const nextPageId = id + 1;
    const nextPageExist = this.pagelist.some(p => p.id === nextPageId);
    if (nextPageExist) {
      this.focusPageById(nextPageId);
      return;
    }

    this.addPage(nextPageId);
  }
}