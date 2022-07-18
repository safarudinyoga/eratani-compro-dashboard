import { useState, useCallback, useEffect } from 'react'
import { Table, Button, message, Modal } from 'antd'
import ImageViewer from "react-simple-image-viewer";
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

// components & styles
import Main from '../../components/main'
import TableControl from '../../components/table-control';
import './blog.sass'
import { _axios } from '../../utils/_axios';
import { getErrorMessage, RESPONSE_STATUS } from '../../utils/apiHelper';

const columns = (openImageViewer, setmodalDelete) => [
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
      <img
        src={blog_image}
        alt='blog'
        onClick={() => openImageViewer([blog_image])}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null // prevents looping
          currentTarget.src =
            'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
        }}
      />
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
    width: 200,
    align: 'center',
    render: (_, { blog_url, blog_id }) => (
      <span className='actions_table'>
        <Link to={`/blog/${blog_url}`}>
          <Button type='primary'>
            Detail
          </Button>
        </Link>
        <span className='delete' onClick={() => setmodalDelete({ id: blog_id, isOpen: true })}><DeleteOutlined /></span>
      </span>
    )
  },
]

const Blog = props => {
  const navigate = useNavigate()
  const [modalDelete, setmodalDelete] = useState({
    id: null,
    isOpen: false
  })
  const [currentImage, setCurrentImage] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false)
  const [data, setData] = useState([])

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
      text: 'Add Blog',
      handleClick: () => navigate('/blog/form')
    }
  }

  useEffect(() => {
    handleFetch()
  }, [])

  const handleFetch = async () => {
    setisLoading(true)

    try {
      // !sementara
      const { data: { data }, status } = await _axios.get(`/api/blogs/category/article`)
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
      const { status } = await _axios.delete(`/api/blogs/${modalDelete.id}`)
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

  return (
    <>
      <Main title='Blogs'>
        <TableControl handleControl={handleControl}  />
        <Table
          loading={isLoading}
          dataSource={data}
          pagination={false}
          columns={columns(openImageViewer, setmodalDelete)}
          className='blog_table'
          rowKey="blog_id"
          key="blog_id"
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

export default Blog