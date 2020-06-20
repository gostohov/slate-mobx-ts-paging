import * as React from 'react'
import './Page.scss'
import { PageState } from './Page.state'
import { observer } from 'mobx-react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor } from 'slate'

export const Page: React.FC<{ state: PageState }> = observer(({ state }) => {
  const editor = React.useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = React.useState(state.value);

  const onChange = (newValue: any) => {
    state.onChange(newValue);
    setValue(newValue)
  };

  return (
    <div className="page">
      <div className="slate-wrapper">
        <Slate
          editor={editor} 
          value={value} 
          onChange={(newValue: any) => onChange(newValue)}>
          <Editable />
        </Slate>
      </div>
    </div>
  )
})