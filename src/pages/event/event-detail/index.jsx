import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate ,useParams } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons';
import ImageViewer from "react-simple-image-viewer";
import dayjs from 'dayjs';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import { slugDictionary } from '../../../utils/slugDictionary';
import '../event.sass'

const EventDetail = props => {
  const navigate = useNavigate();
  const { id } = useParams()

  const nav = [
    {
      link: { handleClick: () => navigate(-1) },
      name: 'Kembali',
      icon: LeftOutlined
    },
    {
      link: '',
      name: `Event - ${id}`,
      icon: null
    },
  ]

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

  const dummy = {
    "event_article": "Event start",
    "event_image": "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
    "event_location": "Event location string",
    "event_start": "2022-07-30T12:30:00Z",
    "event_title": "Test event title",
    "event_url": "test-event-title"
  }

  return (
    <>
      <Main title='Event Detail'>
        <Breadcrumb nav={nav} />
        <div className='event-detail'>
          {Object.keys(dummy).map((item, id) =>
            <div className='event-detail_row' key={id}>
              <h3 className='text_field field'>{slugDictionary[item]}</h3>
              <h3 className="text_field" style={{ margin: '0 5px' }}>:</h3>
              { item === 'event_image' ? <img src={dummy[item]} alt='event' onClick={() => openImageViewer([dummy[item]])} /> : <h3 className="text_field">{dummy[item]}</h3> }
            </div>
          )}
        </div>
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

EventDetail.propTypes = {}

export default EventDetail