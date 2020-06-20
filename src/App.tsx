import * as React from 'react';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Pagelist } from './components/Pagelist/Pagelist';
import { Footer } from './components/Footer/Footer';
import './App.scss';

function App() {
  return (
    <div className="container">
      <Header />
      <div className="body">
        <Sidebar />
        <Pagelist />
      </div>
      <Footer />
    </div>
  );
}

export default App;
