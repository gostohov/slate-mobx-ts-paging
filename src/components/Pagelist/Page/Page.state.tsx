import { observable, action, computed } from 'mobx';
import { Observable, BehaviorSubject, of, Subject, merge, zip, forkJoin } from 'rxjs'
import { distinctUntilChanged, map, mergeMap, tap, withLatestFrom, windowTime, concatMap, distinct, debounceTime, last } from 'rxjs/operators';
import { ReactEditor } from 'slate-react';
import { Editor, Node } from 'slate';

export interface PageEvent {
  id: number;
  isOverflow: boolean;
  editor: ReactEditor;
  textExist: boolean;
}
export class PageState {
  id: number;
  value: any = [
    {
      type: 'paragraph',
      children: [
        { text: 'This is editable ' },
        { text: 'rich', bold: true },
        { text: ' text, ' },
        { text: 'much', italic: true },
        { text: ' better than a ' },
        { text: '<textarea>', code: true },
        { text: '!' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: 'bold', bold: true },
        {
          text:
            ', or add a semantically rendered block quote in the middle of the page, like this:',
        },
      ],
    },
    {
      type: 'block-quote',
      children: [{ text: 'A wise quote.' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Try it out for yourself!' }],
    },
  ];

  @observable focus = false;
  @observable field = { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' };
  
  @observable editor$: Subject<ReactEditor> = new Subject<ReactEditor>();
  @observable overflow$: Subject<boolean> = new Subject<boolean>();
  @observable textExist$: Subject<boolean> = new Subject<boolean>();
  @observable pageEvent$: Observable<any> = zip(
    this.editor$,
    this.overflow$.pipe(
      windowTime(100),
      concatMap(obs => obs.pipe(distinct())),
    ),
    this.textExist$.pipe(tap(console.log)),
  ).pipe(
    map(([editor, isOverflow, textExist]) => {
      return { 
        id: this.id, 
        isOverflow,
        editor,
        textExist
      };
    })
  );

  constructor(
    private props: { id: number }
  ) {
    this.id = props.id;
  }

  @action
  onChange(newValue: any): void {
    this.value = newValue;
  }

  @action
  isOverflow(height: number): boolean {
    return height >= this.maxSize;
  }

  @action
  onKeyDown(event: React.KeyboardEvent<HTMLDivElement>, editor: ReactEditor): void {
    const textExist = Node.string(editor) !== '';
    console.log(textExist)
    this.textExist$.next(textExist);
    this.editor$.next(editor);
    if (!textExist) {
      this.overflow$.next(false);
      return;
    }
  }

  @computed
  get fieldOffset(): string {
    const {top, right, bottom, left} = this.field;
    return `${top} ${right} ${bottom} ${left}`;
  }

  @computed
  get maxSize(): number {
    const top = this.field.top.split('cm')[0];
    const bottom = this.field.bottom.split('cm')[0];
    const offset = (29.7 - (parseInt(top) + parseInt(bottom))) / 2.54 * 96;
    return offset;
  }
}