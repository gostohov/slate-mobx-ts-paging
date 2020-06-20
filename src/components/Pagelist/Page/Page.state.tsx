import { observable, action, computed } from 'mobx';
import { PagelistState } from '../Pagelist.state';
import { useRef } from 'react';

export class PageState {
  id: number;
  value: any = [
    {
      type: 'paragraph',
      children: [
        { text: '' },
      ]
    }
  ];

  @observable wrapperRef: any;
  @observable focus = false;
  @observable field = {
    top: '2cm',
    right: '2cm',
    bottom: '2cm',
    left: '2cm'
  };

  constructor(
    private pagelistState: PagelistState,
    private props: { id: number }
  ) {
    this.id = props.id;
  }

  @action
  onChange(newValue: any): void {
    this.value = newValue;
  }

  @action
  overflowDetect(height: number): boolean {
    const offset = this.calculateOffsetFromField();
    const divHeight = height - offset;

    if (!height || divHeight < 972) { 
      return false;
    }

    this.pagelistState.overflowHandle(this.id);
    return true;
  }

  @computed
  get fieldOffset(): string {
    const {top, right, bottom, left} = this.field;
    return `${top} ${right} ${bottom} ${left}`;
  }

  @action
  calculateOffsetFromField(): number {
    const top = this.field.top.split('cm')[0];
    const bottom = this.field.bottom.split('cm')[0];
    const offset = (parseInt(top) + parseInt(bottom)) / 2.54 * 96;
    return offset;
  }
}