import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import ImageViewer from "react-simple-image-viewer";
import { Link, useNavigate } from 'react-router-dom';

// components & styles
import Main from '../../components/main'
import TablePagination from '../../components/table-pagination';
import TableControl from '../../components/table-control';
import './blog.sass'

const dummy = [
  {
      "BlogCreator": "",
      "blog_article": "Blog article",
      "blog_category": "Abc",
      "blog_id": 1,
      "blog_image": "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
      "blog_title": "Test blog title",
      "blog_url": "test-blog-title",
      "created_at": "2022-06-27T14:39:41.507893Z"
  },
  {
      "BlogCreator": "",
      "blog_article": "Blog article",
      "blog_category": "Abc",
      "blog_id": 2,
      "blog_image": "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
      "blog_title": "Test blog title",
      "blog_url": "test-blog-title-1",
      "created_at": "2022-06-27T15:05:19.761976Z"
  }
]

const columns = (openImageViewer) => [
  {
    title: 'Title',
    dataIndex: 'blog_title',
    key: 'blog_title',
    render: (_, { blog_title }) => blog_title || '-'
  },
  {
    title: 'Image',
    dataIndex: 'blog_image',
    key: 'blog_image',
    render: (_, { blog_image }) => (
      <img src={blog_image} alt='blog' onClick={() => openImageViewer([blog_image])} />
    )
  },
  {
    title: 'Category',
    dataIndex: 'blog_category',
    key: 'blog_category',
    render: (_, { blog_category }) => blog_category || ''
  },
  {
    title: '',
    key: 'viewDetail',
    render: (_, { blog_id }) => (
      <span>
        <Link to={`/blog/${blog_id}`}>
          <Button type='primary'>
            Detail
          </Button>
        </Link>
      </span>
    )
  },
]

const Blog = props => {
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
      text: 'Add Blog',
      handleClick: () => navigate('/blog/form')
    }
  }

  return (
    <>
      <Main title='Blogs'>
        <TableControl handleControl={handleControl}  />
        <Table
          dataSource={dummy}
          pagination={false}
          columns={columns(openImageViewer)}
          className='blog_table'
          rowKey="blog_id"
          key="blog_id"
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

Blog.propTypes = {}

export default Blog