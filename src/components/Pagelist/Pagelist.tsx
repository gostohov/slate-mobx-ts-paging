import * as React from 'react'
import { observer } from 'mobx-react';
import { PagelistState } from './Pagelist.state';

import './Pagelist.scss'
import { SidebarState } from '../Sidebar/Sidebar.state';

export const Pagelist: React.FC<{ state: PagelistState, sidebarState: SidebarState }> = observer(({ state, sidebarState }) => {
  React.useEffect(() => state.focusPageById(1), []);

  return (
    <div className={`page-list ${sidebarState.open ? '' : 'sidebar-closed'}`}>
      {state.pageElementList}
    </div>
  )
})