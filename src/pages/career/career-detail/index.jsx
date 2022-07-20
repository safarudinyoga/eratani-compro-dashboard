/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Button, message, Skeleton } from 'antd'
import { useNavigate ,useParams } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import { slugDictionary } from '../../../utils/slugDictionary';
import '../career.sass'
import { _axios } from '../../../utils/_axios';
import { getErrorMessage, RESPONSE_STATUS } from '../../../utils/apiHelper';

const CareerDetail = () => {
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
        {isLoading ? <Skeleton /> : (
          <>
            {Object.keys(data).filter(res => slugDictionary[res]).map((item, id) =>
              ['job_requirements', 'job_responsibilities', 'job_benefits'].includes(item) ? (
                <div className='career-detail_row' key={id}>
                  <h3 className='text_field field'>{slugDictionary[item]}</h3>
                  <h3 className="text_field" style={{ margin: '0 5px' }}>:</h3>
                  <div dangerouslySetInnerHTML={{ __html: data[item] }}></div>
                </div>
              ) : (
                <div className='career-detail_row' key={id}>
                  <h3 className='text_field field'>{slugDictionary[item]}</h3>
                  <h3 className="text_field" style={{ margin: '0 5px' }}>:</h3>
                  <h3 className="text_field">{data[item]}</h3>
                </div>
              )
            )}
            <Button type='primary' onClick={() => navigate(`/career/form/${data.job_url}`, {
              state: {
                id: data.job_id,
                url: data.job_url,
              }
            })}>Edit</Button>
          </>
        )}
      </div>
    </Main>
  )
}

export default CareerDetail