import { Icon } from '@iconify/react'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='relative hidden'>
        <button><Icon icon="sidekickicons:sidebar-right-20-solid" width={20} height={20}  style={{color:"#7500b8"}} /></button>
    </div>
  )
}

export default Sidebar