/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useEffect } from 'react'
import { useNavigate ,useParams } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons';
import ImageViewer from "react-simple-image-viewer";
import { Button, message, Skeleton } from 'antd';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import { slugDictionary } from '../../../utils/slugDictionary';
import '../event.sass'
import { _axios } from '../../../utils/_axios';
import { getErrorMessage, RESPONSE_STATUS } from '../../../utils/apiHelper';
import dayjs from 'dayjs';

const EventDetail = props => {
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
      const { data: { data }, status } = await _axios.get(`/api/events/url/${id}`)
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
      name: `Event - ${id}`,
      icon: null
    },
  ]

  const [currentImage, setCurrentImage] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((index) => {
    if (!index.length) return

    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <>
      <Main title='Event Detail'>
        <Breadcrumb nav={nav} />
        <div className='event-detail'>
          {isLoading ? <Skeleton /> : (
            <>
              {Object.keys(data).filter(res => slugDictionary[res]).map((item, id) =>
                <div className='event-detail_row' key={id}>
                  <h3 className='text_field field'>{slugDictionary[item]}</h3>
                  <h3 className="text_field" style={{ margin: '0 5px' }}>:</h3>
                  { item === 'event_image' ? (
                    <img
                      src={data[item]}
                      alt='event'
                      onClick={() => openImageViewer([data[item]])}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null // prevents looping
                        currentTarget.src =
                          'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
                      }}
                    />
                  ) : item === 'event_article' ? (
                    <div dangerouslySetInnerHTML={{ __html: data[item] }}></div>
                  ) : (
                    <h3 className="text_field">{item === 'event_start' ? dayjs(data[item]).format('DD-MM-YYYY') : data[item]}</h3>
                  )}
                </div>
              )}
              <Button type='primary' onClick={() => navigate(`/event/form/${data.event_url}`, {
                state: {
                  id: data.event_id,
                  url: data.event_url,
                }
              })}>Edit</Button>
            </>
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

export default EventDetail