import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate ,useParams } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import { slugDictionary } from '../../../utils/slugDictionary';
import '../career.sass'

const CareerDetail = props => {
  const navigate = useNavigate();
  const { id } = useParams()

  const dummy = {
    "job_application_deadline": dayjs("2022-07-30T12:30:00Z").format('DD - MM - YYYY'),
    "job_benefits": "Test job benefits",
    "job_category": "Test job category",
    "job_experience": 5,
    "job_level": "Test job level",
    "job_link_url": "Test job link url",
    "job_location": "Test job location",
    "job_requirements": "Test job requirements",
    "job_title": "Test job title",
    "job_type": "Test job type",
    "job_url": "test-job-title"
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
      {Object.keys(dummy).map((item, id) =>
        <div className='career-detail_row' key={id}>
          <h3 className='text_field field'>{slugDictionary[item]}</h3>
          <h3 className="text_field" style={{ margin: '0 5px' }}>:</h3>
          <h3 className="text_field">{dummy[item]}</h3>
        </div>
      )}
      </div>
    </Main>
  )
}

CareerDetail.propTypes = {}

export default CareerDetail