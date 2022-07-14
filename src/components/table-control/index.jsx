import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'

import './tableheader.sass'

const TableControl = ({
  handleControl
}) => {

  return (
    <div className='table-control'>
      <div className='table-control_start_block'>
        {/* if there any filter insert here */}
        <></>
      </div>
      <div className='table-control_end_block'>
        { handleControl &&
          <Button type='primary' onClick={handleControl.button.handleClick}>{handleControl.button.text}</Button>
        }
      </div>
    </div>
  )
}

TableControl.propTypes = {}

export default TableControl