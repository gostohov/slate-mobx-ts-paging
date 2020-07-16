import * as React from 'react'
import { PageState } from './Page.state'
import { observer } from 'mobx-react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Element } from './Element'
import { Leaf } from './Leaf'
import ReactResizeDetector from 'react-resize-detector'

import './Page.scss'

export const Page: React.FC<{ state: PageState }> = observer(({ state }) => {
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), []);
  const renderElement = React.useCallback(props => <Element {...props} />, [])
  const renderLeaf = React.useCallback(props => <Leaf {...props} />, [])
  const [value, setValue] = React.useState(state.value);

  const onChange = (newValue: any) => {
    state.onChange(newValue);
    setValue(newValue);
  };

  return (
    <div className="page">
      <div 
        className="page-offset" 
        style={{ padding: state.fieldOffset }} 
      >
        <ReactResizeDetector 
          handleHeight
          skipOnMount
        >
          {({ height, targetRef }: { height: number, targetRef: any }) => {
            state.overflow = state.isOverflow(height);
            return (
              <div ref={targetRef} className="slate-wrapper">
                <Slate
                  editor={editor} 
                  value={value}
                  onChange={(newValue: any) => onChange(newValue)}
                >
                  <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Введите текст..."
                    spellCheck
                    autoFocus={state.focus}
                    onKeyDown={event => state.onKeyDown(event, editor)}
                  />
                </Slate>        
              </div>
            );
          }}
        </ReactResizeDetector>
      </div>
    </div>
  )
})