import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'

import './tableheader.sass'

const TableControl = ({
  handleControl
}) => {
  const { button: { text, handleClick } } = handleControl

  return (
    <div className='table-control'>
      <div className='table-control_start_block'>
        {/* if there any filter insert here */}
        <></>
      </div>
      <div className='table-control_end_block'>
        <Button type='primary' onClick={handleClick}>{text}</Button>
      </div>
    </div>
  )
}

TableControl.propTypes = {}

export default TableControl