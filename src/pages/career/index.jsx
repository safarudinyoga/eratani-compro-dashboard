import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import dayjs from 'dayjs'
import { Link, useNavigate } from 'react-router-dom';

import Main from '../../components/main'
import TableControl from '../../components/table-control'
import './career.sass'
import TablePagination from '../../components/table-pagination'

const dummy = [
  {
      "job_application_deadline": "2022-07-30T12:30:00Z",
      "job_benefits": "Test job benefits",
      "job_category": "Test job category",
      "job_experience": 5,
      "job_id": 1,
      "job_level": "Test job level",
      "job_link_url": "Test job link url",
      "job_location": "Test job location",
      "job_requirements": "Test job requirements",
      "job_title": "Test job title",
      "job_type": "Test job type",
      "job_url": "test-job-title"
  }
]

const columns = () => [
  {
    title: 'Title',
    dataIndex: 'job_title',
    key: 'job_title',
    render: (_, { job_title }) => job_title || '-'
  },
  {
    title: 'Level, Type, Experience',
    dataIndex: 'job_type',
    key: 'job_type',
    render: (_, { job_type, job_level, job_experience }) => `${job_type}, ${job_level}, ${job_experience}` || '-'
  },
  {
    title: 'Deadline',
    dataIndex: 'job_application_deadline',
    key: 'job_application_deadline',
    render: (_, { job_application_deadline }) => dayjs(job_application_deadline).format('DD - MM - YYYY') || '-'
  },
  {
    title: 'Link URL',
    dataIndex: 'job_url',
    key: 'job_url',
    render: (_, { job_url }) => job_url || '-'
  },
  {
    title: '',
    key: 'viewDetail',
    render: (_, { job_id }) => (
      <span>
        <Link to={`/career/${job_id}`}>
          <Button type='primary'>
            Detail
          </Button>
        </Link>
      </span>
    )
  },
]



const Career = props => {
  const navigate = useNavigate()

  const handleControl = {
    button: {
      text: 'Add Career',
      handleClick: () => navigate('/career/form')
    }
  }
  return (
    <Main title='Careers'>
      <TableControl handleControl={handleControl} />
      <Table
        dataSource={dummy}
        pagination={false}
        columns={columns()}
        className=''
        rowKey="job_id"
        key="job_id"
      />
      <TablePagination
        pagination={{
          page: 1,
          total: 2,
          limit: 10
        }}
        showPageNumber
        go={() => console.log()}
      />
    </Main>
  )
}

Career.propTypes = {}

export default Career