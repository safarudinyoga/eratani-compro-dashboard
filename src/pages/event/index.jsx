import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import ImageViewer from "react-simple-image-viewer";
import { Link, useNavigate } from 'react-router-dom';

import Main from '../../components/main'
import TableControl from '../../components/table-control'
import TablePagination from '../../components/table-pagination'
import dayjs from 'dayjs';
import './event.sass'

const dummy = [
  {
      "event_article": "Event start",
      "event_id": 1,
      "event_image": "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
      "event_location": "Event location string",
      "event_start": "2022-07-30T12:30:00Z",
      "event_title": "Test event title",
      "event_url": "test-event-title"
  }
]

const columns = (openImageViewer) => [
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
    render: (_, { event_image }) => <img src={event_image} alt='career' onClick={() => openImageViewer([event_image])} /> || '-'
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
    render: (_, { event_id }) => (
      <span>
        <Link to={`/event/${event_id}`}>
          <Button type='primary'>
            Detail
          </Button>
        </Link>
      </span>
    )
  },
]

const Event = props => {
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((index) => {
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
          dataSource={dummy}
          pagination={false}
          columns={columns(openImageViewer)}
          className='event_table'
          rowKey="event_id"
          key="event_id"
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
    </>
  )
}

Event.propTypes = {}

export default Event