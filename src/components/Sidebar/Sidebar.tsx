import * as React from 'react'
import { observer } from 'mobx-react';
import { SidebarState } from './Sidebar.state'
import './Sidebar.scss'

export const Sidebar: React.FC<{ state: SidebarState }> = observer(({ state }) => {
	return (
		<div className={`sidebar-container ${state.open ? '' : 'closed'}`}>
			<div className="sidebar-list"></div>
			<button 
				className={`toggle-btn ${state.open ? '' : 'sidebar-closed'}`}
				onClick={() => state.toggle()}
				>{state.open ? '<<' : '>>'}
			</button>
		</div>
	)
})