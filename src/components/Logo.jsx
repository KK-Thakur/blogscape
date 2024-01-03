import React from 'react'
import appLogo from '../assets/blogscape.png'

function Logo({width = '100px'}) {
  return (
    <div>
        <img src={appLogo} alt="" style={{width: '8rem'}}/>
    </div>
  )
}

export default Logo