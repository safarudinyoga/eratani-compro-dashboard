import { useState, useEffect } from 'react'
import { Table, Button, message, Modal } from 'antd'
import dayjs from 'dayjs'
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

import Main from '../../components/main'
import TableControl from '../../components/table-control'
import './career.sass'
import { _axios } from '../../utils/_axios';
import { getErrorMessage, RESPONSE_STATUS } from '../../utils/apiHelper';

const columns = (setmodalDelete) => [
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
    render: (_, { job_url, job_id }) => (
      <span className='actions_table'>
        <Link to={`/career/${job_url}`}>
          <Button type='primary'>
            Detail
          </Button>
        </Link>
        <span className='delete' onClick={() => setmodalDelete({ id: job_id, isOpen: true })}><DeleteOutlined /></span>
      </span>
    )
  },
]

const Career = () => {
  const [isLoading, setisLoading] = useState(false)
  const [dataList, setdataList] = useState([])
  const navigate = useNavigate()
  const [modalDelete, setmodalDelete] = useState({
    id: null,
    isOpen: false
  })

  useEffect(() => {
    handleFetchList()
  }, [])

  const handleFetchList = async() => {
    setisLoading(true)

    try {
      const { data: { data }, status } = await _axios.get('/api/jobs')
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        setdataList(data)
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const handleControl = {
    button: {
      text: 'Add Career',
      handleClick: () => navigate('/career/form')
    }
  }

  const handleDelete = async() => {
    setisLoading(true)

    try {
      const { status } = await _axios.delete(`/api/jobs/${modalDelete.id}`)
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        message.success('Berhasil Menghapus Data')
        handleFetchList()
        setmodalDelete({
          isOpen: false,
          id: null
        })
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <Main title='Careers'>
        <TableControl handleControl={handleControl} />
        <Table
          loading={isLoading}
          dataSource={dataList}
          pagination={false}
          columns={columns(setmodalDelete)}
          className=''
          rowKey="job_id"
          key="job_id"
        />
      </Main>

      <Modal
        title="Konfirmasi"
        visible={modalDelete.isOpen}
        onOk={handleDelete}
        confirmLoading={isLoading}
        onCancel={() => setmodalDelete({ id: null, isOpen: false })}
      >
        <p>Apakah anda yakin ingin menghapus data ini ?</p>
      </Modal>
    </>
  )
}

export default Career