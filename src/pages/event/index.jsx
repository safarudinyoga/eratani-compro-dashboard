import { useState, useCallback, useEffect } from 'react'
import { Table, Button, message, Modal } from 'antd'
import ImageViewer from "react-simple-image-viewer";
import { Link, useNavigate } from 'react-router-dom';

import Main from '../../components/main'
import TableControl from '../../components/table-control'
import dayjs from 'dayjs';
import './event.sass'
import { _axios } from '../../utils/_axios';
import { getErrorMessage, RESPONSE_STATUS } from '../../utils/apiHelper';
import { DeleteOutlined } from '@ant-design/icons';

const columns = (openImageViewer, setmodalDelete) => [
  {
    title: 'Title',
    dataIndex: 'event_title',
    key: 'event_title',
    render: (_, { event_title }) => event_title || '-'
  },
  {
    title: 'Image',
    dataIndex: 'event_image',
    key: 'event_image',
    render: (_, { event_image }) => (
      <img
        src={event_image}
        alt='event'
        onClick={() => openImageViewer([event_image])}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null // prevents looping
          currentTarget.src =
            'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
        }}
      />
    ) || '-'
  },
  {
    title: 'Location & date',
    dataIndex: 'event_location',
    key: 'event_location',
    render: (_, { event_location, event_start }) => `${event_location}, ${dayjs(event_start).format('DD - MM - YYYY')}` || '-'
  },
  {
    title: '',
    key: 'viewDetail',
    render: (_, { event_url, event_id }) => (
      <span className='actions_table'>
        <Link to={`/event/${event_url}`}>
          <Button type='primary'>
            Detail
          </Button>
        </Link>
        <span className='delete' onClick={() => setmodalDelete({ id: event_id, isOpen: true })}><DeleteOutlined /></span>
      </span>
    )
  },
]

const Event = () => {
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false)
  const [modalDelete, setmodalDelete] = useState({
    id: null,
    isOpen: false
  })
  const [data, setData] = useState([])
  const [currentImage, setCurrentImage] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    handleFetch()
  }, [])

  const handleFetch = async() => {
    setisLoading(true)

    try {
      const { data: { data }, status } = await _axios.get('/api/events')
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        setData(data)
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const handleDelete = async() => {
    setisLoading(true)

    try {
      const { status } = await _axios.delete(`/api/events/${modalDelete.id}`)
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        message.success('Berhasil Menghapus Data')
        handleFetch()
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

  const openImageViewer = useCallback((index) => {
    if (!index.length) return

    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const handleControl = {
    button: {
      text: 'Add Event',
      handleClick: () => navigate('/event/form')
    }
  }

  return (
    <>
      <Main title='Event'>
        <TableControl handleControl={handleControl} />
        <Table
          loading={isLoading}
          dataSource={data}
          pagination={false}
          columns={columns(openImageViewer, setmodalDelete)}
          className='event_table'
          rowKey="event_id"
          key="event_id"
        />
      </Main>

      {isViewerOpen && (
        <ImageViewer
          src={currentImage}
          currentIndex={0}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          closeOnClickOutside={true}
        />
      )}

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

export default Event