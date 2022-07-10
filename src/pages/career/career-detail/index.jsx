import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, message } from 'antd'
import { useNavigate ,useParams } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import { slugDictionary } from '../../../utils/slugDictionary';
import '../career.sass'
import { _axios } from '../../../utils/_axios';
import { getErrorMessage, RESPONSE_STATUS } from '../../../utils/apiHelper';

const CareerDetail = props => {
  const [isLoading, setisLoading] = useState(false)
  const [data, setData] = useState({})

  const navigate = useNavigate();
  const { id } = useParams()

  useEffect(() => {
    handleFetchDetail()
  }, [])

  const handleFetchDetail = async() => {
    setisLoading(true)

    try {
      const { data: { data }, status } = await _axios.get(`/api/jobs/url/${id}`)
      if (RESPONSE_STATUS.includes(status)) {
        delete data['job_id']
        setisLoading(false)
        setData(data)
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }


  const nav = [
    {
      link: { handleClick: () => navigate(-1) },
      name: 'Kembali',
      icon: LeftOutlined
    },
    {
      link: '',
      name: `Career - ${id}`,
      icon: null
    },
  ]

  return (
    <Main title='Career Detail'>
      <Breadcrumb nav={nav} />
      <div className='career-detail'>
      {Object.keys(data).map((item, id) =>
        <div className='career-detail_row' key={id}>
          <h3 className='text_field field'>{slugDictionary[item]}</h3>
          <h3 className="text_field" style={{ margin: '0 5px' }}>:</h3>
          <h3 className="text_field">{data[item]}</h3>
        </div>
      )}

      <Button type='primary' onClick={() => navigate(`/career/form/${data.job_url}`)}>Edit</Button>
      </div>
    </Main>
  )
}

CareerDetail.propTypes = {}

export default CareerDetail