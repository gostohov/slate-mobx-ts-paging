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
    { id: 1, state: new PageState() }, 
    { id: 2, state: new PageState() }, 
    { id: 3, state: new PageState() }
  ];

  @action 
  addPage(prevIndex: number): void {
    const page = { 
      id: this.pagelist.length + 1,
      state: new PageState()
    };
    this.pagelist.splice(prevIndex, 0, page);
  }

  @computed
  get pageElementList(): JSX.Element[] {
    return this.pagelist.map(({ id, state }) => <Page key={`page-${id}`} state={state}/>);
  }
}