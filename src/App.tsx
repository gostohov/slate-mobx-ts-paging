import * as React from 'react';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Pagelist } from './components/Pagelist/Pagelist';
import { Footer } from './components/Footer/Footer';
import './App.scss';
import { AppState } from './App.state';
import { observer } from 'mobx-react';

export const App: React.FC<{ state: AppState }> = observer(({ state }) => {
	return (
		<div className="container">
      <Header />
      <div className="body">
        <Sidebar state={state.sidebar}/>
        <Pagelist state={state.pagelist} sidebarState={state.sidebar}/>
      </div>
      <Footer />
    </div>
	)
})