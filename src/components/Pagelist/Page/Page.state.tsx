import { observable, action } from 'mobx';

export class PageState {
  value: any = [
    {
      type: 'paragraph',
      children: [
        { text: '' },
      ]
    }
  ];

  @action
  onChange(newValue: any): void {
    this.value = newValue;
  }
}