import * as React from 'react'
import { PageState } from './Page.state'
import { observer } from 'mobx-react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'

import './Page.scss'

export const Page: React.FC<{ state: PageState }> = observer(({ state }) => {
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), []);
  const renderElement = React.useCallback(props => <Element {...props} />, [])
  const renderLeaf = React.useCallback(props => <Leaf {...props} />, [])
  const [value, setValue] = React.useState(state.value);

  const ref = React.useRef(null);
  React.useEffect(() => { state.wrapperRef = ref }, []);

  const onChange = (newValue: any) => {
    state.onChange(newValue);
    setValue(newValue)
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const elHeight = (state.wrapperRef.current as any).clientHeight;
    const isOverflow = state.overflowDetect(elHeight);
    if (isOverflow) event.preventDefault();
  }

  return (
    <div className="page">
      <div style={{ padding: state.fieldOffset }} ref={state.wrapperRef}>
        <Slate
          editor={editor} 
          value={value}
          onChange={(newValue: any) => onChange(newValue)}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Введите текст..."
            spellCheck
            autoFocus={state.focus}
            onKeyDown={event => onKeyDown(event)}
          />
        </Slate>
      </div>
    </div>
  )
})

const Element: React.FC<{ attributes: any, children: any, element: any }> = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf: React.FC<{ attributes: any, children: any, leaf: any }> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}