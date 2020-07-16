import * as React from 'react';
import { observable, computed, autorun, toJS, intercept } from 'mobx';
import { Page } from './Page/Page';
import { PageState } from './Page/Page.state';
import { hasEffect } from '../../util/keyboard';
import { Node } from 'slate';

export interface IPage {
  id: number,
  state: PageState,
  disposer: () => void
};

export class PagelistState {
  @observable pagelist: IPage[] = [];

  constructor() {
    autorun(this._init);
  }

  @computed
  get pageElementList(): JSX.Element[] {
    return this.pagelist.map(({ id, state }) => <Page key={`page-${id}`} state={state}/>);
  }

  private _init = () => {
    this._addPage(0);
  }

  private _addPage(prevId: number): void {
    const nextPageExist = this.pagelist.some(page => page.id === (prevId + 1));
    if (nextPageExist) return;

    const newPageId = prevId + 1;
    const newPageStore = new PageState({ id: newPageId });
    const disposer = intercept(newPageStore, this._handlePageEvent)
    const page = { id: newPageId, state: newPageStore, disposer };
    this.pagelist.push(page);
  }

  private _removePage(id: number): void {
    const isFirstPage = this.pagelist[0].id === id;
    if (isFirstPage) return;

    const pageToRemove = this.pagelist.find(p => p.id === id);
    pageToRemove?.disposer();
    this.pagelist = this.pagelist.filter(p => p.id !== id);
  }

  private _handlePageEvent = (change: any) => {
    const name = change.name;
    switch (name) {
      case 'overflow': 
        this._processOverflow(change);
        return change;
      case 'emptyPage':
        this._processEmptyPage(change);
        return change;
      default:
        return change;
    }
  }

  private _processOverflow(change: any): void {
    const prevId = change.object.id;
    const keyEvent = change.object.keyDownEvent;
    const keyCode = keyEvent?.keyCode;
    const isOverflow = toJS(change.newValue);
    if (isOverflow && hasEffect(keyCode)) { 
      this._addPage(prevId);
    }

  }

  private _processEmptyPage(change: any): void {
    const id = change.object.id;
    const keyEvent = change.object.keyDownEvent;
    const key = keyEvent?.key;
    const isPageEmpty = toJS(change.newValue);
    if (isPageEmpty && key === 'Backspace') {
      this._removePage(id);
    }
  }

  private _sendBlockForward(node: Node): void {
    
  }

  private _sendCharacterForward(char: string): void {

  }

}