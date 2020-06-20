import * as React from 'react'
import { PageState } from './Page.state'
import { observer } from 'mobx-react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor } from 'slate'

import './Page.scss'

export const Page: React.FC<{ state: PageState }> = observer(({ state }) => {
  const editor = React.useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = React.useState(state.value);

  const ref = React.useRef(null);
  React.useEffect(() => { state.wrapperRef = ref }, []);

  const onChange = (newValue: any) => {
    state.onChange(newValue);
    setValue(newValue)
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const elHeight = (state.wrapperRef.current as any).clientHeight;
    state.overflowDetect(elHeight);
  }

  return (
    <div className="page">
      <div style={{ padding: state.fieldOffset }} ref={state.wrapperRef}>
        <Slate
          editor={editor} 
          value={value}
          onChange={(newValue: any) => onChange(newValue)}>
          <Editable 
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