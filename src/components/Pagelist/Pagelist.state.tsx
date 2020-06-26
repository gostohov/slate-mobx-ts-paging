import * as React from 'react';
import { observable, action, computed } from 'mobx';
import { Page } from './Page/Page';
import { PageState, PageEvent } from './Page/Page.state';
import { Observable, BehaviorSubject, zip, of, merge } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';
import { ReactEditor } from 'slate-react';
import { Editor, Node } from 'slate';

export interface IPage {
  id: number,
  state: PageState
};

export class PagelistState {
  private _pageListObs$: BehaviorSubject<Observable<any>> = new BehaviorSubject<Observable<any>>(of(null));

  @observable pagelist: IPage[] = [];

  constructor() {
    this._pageListObs$.pipe(
      switchMap(obs$ => obs$)
    ).subscribe();
    this._subToPageOverflowObs();
    this._init();
  }

  @computed
  get pageElementList(): JSX.Element[] {
    return this.pagelist.map(({ id, state }) => <Page key={`page-${id}`} state={state}/>);
  }

  @action 
  addPage(prevId: number): void {
    const nextPageExist = this.pagelist.some(page => page.id === (prevId + 1));
    if (nextPageExist) return;

    const nextPageId = prevId + 1;
    const page = { id: nextPageId, state: new PageState({ id: nextPageId }) };
    this.pagelist.push(page);
    this._subToPageOverflowObs();
  }

  @action
  removePage(id: number): void {
    const isFirstPage = this.pagelist[0].id === id;
    if (isFirstPage) return;

    this.pagelist = this.pagelist.filter(p => p.id !== id);
    this._subToPageOverflowObs();
  }

  private _init(): void {
    this.addPage(0);
  }

  private _subToPageOverflowObs(): void {
    const obs$ = merge(...this.pagelist.map(page => page.state.pageEvent$.pipe(
      tap((pageEvent: PageEvent) => {
        console.log(pageEvent);
        if (pageEvent.isOverflow) { this._processOverflow(pageEvent); } 
        else { this._processNotOverflow(pageEvent); }
      })
    )))
    this._pageListObs$.next(obs$);
  }

  private _processOverflow(pageEvent: PageEvent): void {
    this.addPage(pageEvent.id);
    const lastBlock = this._getLastBlock(pageEvent.editor);
    const [...leafs] = Node.texts(lastBlock) as Array<any>;
    const nodeString = Node.string(lastBlock);
    console.log(nodeString);
  }

  private _processNotOverflow(pageEvent: PageEvent): void {
    const { textExist, isOverflow } = pageEvent;
    if (!textExist && !isOverflow) this.removePage(pageEvent.id);
  }

  private _getLastBlock(editor: ReactEditor): Node {
    const [...nodes] = Editor.nodes(editor, {at: [], match: n => Editor.isBlock(editor, n) }) as Array<any>;
    const [lastBlock] = nodes[nodes.length - 1];
    return lastBlock;
  }
}