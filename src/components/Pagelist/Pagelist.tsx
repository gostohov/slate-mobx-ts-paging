import * as React from 'react'
import { Page } from './Page/Page';
import './Pagelist.scss'

export const Pagelist = () => {
  const list = () => {
    return [{ id: 1}].map(el => {
      const key = `page-${el.id}`;
      const props = {
        id: el.id
      };
      return <Page {...props} key={key}/>
    })
  }

  return (
    <div className="page-list">
      {list()}
    </div>
  )
}