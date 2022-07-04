import React from 'react'

const TextError = ({ children }) => {
  return (
    <p className='global-error-message'>{children}</p>
  )
}

export default TextError