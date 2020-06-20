import * as React from 'react';
import { observable, action } from 'mobx';
import { Page } from './Page/Page';

export interface IPage {
  id: number
};

export class PagelistState {
  @observable
  pagelist: IPage[] = [{ id: 1 }, { id: 2 }, { id: 3 }];

  @action 
  addPage(prevIndex: number): void {
    const page = { 
      id: this.pagelist.length + 1 
    };
    this.pagelist.splice(prevIndex, 0, page);
  }

  @action
  getPageElementList(): JSX.Element[] {
    return this.pagelist.map(({ id }) => <Page key={`page-${id}`}/>);
  }
}