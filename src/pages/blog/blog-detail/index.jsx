import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate ,useParams } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons';
import ImageViewer from "react-simple-image-viewer";
import dayjs from 'dayjs';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import { slugDictionary } from '../../../utils/slugDictionary';
import '../blog.sass'
import { Button } from 'antd';

const BlogDetail = props => {
  const navigate = useNavigate();
  const { id } = useParams()

  const dummy = {
    "BlogCreator": "",
    "blog_article": "Blog article",
    "blog_category": "Abc",
    "blog_image": "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
    "blog_title": "Test blog title",
    "blog_url": "test-blog-title",
    "created_at": dayjs("2022-06-27T14:39:41.507893Z").format('DD - MM - YYYY')
  }

  const nav = [
    {
      link: { handleClick: () => navigate(-1) },
      name: 'Kembali',
      icon: LeftOutlined
    },
    {
      link: '',
      name: `Blog - ${id}`,
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

  return (
    <>
      <Main title='Blog Detail'>
        <Breadcrumb nav={nav} />
        <div className='blog-detail'>
          {Object.keys(dummy).map((item, i) =>
            <div className='blog-detail_row' key={i}>
              <h3 className='text_field field'>{slugDictionary[item]}</h3>
              <h3 className="text_field" style={{ margin: '0 5px' }}>:</h3>
              { item === 'blog_image' ? <img src={dummy[item]} alt='blog' onClick={() => openImageViewer([dummy[item]])} /> : <h3 className="text_field">{dummy[item]}</h3> }
            </div>
          )}
        <Button type='primary' onClick={() => navigate(`/blog/form/${dummy.blog_url}`)}>Edit</Button>
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

BlogDetail.propTypes = {}

export default BlogDetail