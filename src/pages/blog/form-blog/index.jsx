/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react'
import ImageViewer from "react-simple-image-viewer";
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { LeftOutlined, CloudUploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, Input, message, Upload, Select } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import '../blog.sass'
import TextError from '../../../components/error-message';
import { getErrorMessage, RESPONSE_STATUS } from '../../../utils/apiHelper';
import { _axios } from '../../../utils/_axios';

const { Option } = Select;

const FormBlog = props => {
  const location = useLocation()
  const navigate = useNavigate();
  const { url: paramsURL } = useParams()

  const [isLoading, setisLoading] = useState(false)
  const [isUploading, setisUploading] = useState(false)
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

  useEffect(() => {
    if (!paramsURL) return

    fetchDetailForm()
  }, [])

  const fetchDetailForm = async() => {
    setisLoading(true)

    try {
      const { data: { data }, status } = await _axios.get(`/api/blogs/url/${paramsURL}`)
      if (RESPONSE_STATUS.includes(status)) {
        setValues({
          blog_title: data.blog_title,
          blog_image: data.blog_image,
          blog_article: data.blog_article,
          blog_category: data.blog_category
        })
        setisLoading(false)
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
      name: `Form`,
      icon: null
    },
  ]

  const blogCategory = [
    {
      label: 'Artikel',
      value: 'article'
    },
    {
      label: 'Tips',
      value: 'tips'
    },
  ]

  const { handleChange, handleSubmit, setFieldValue, values, errors, touched, setValues } = useFormik({
    initialValues: {
      blog_title: '',
      blog_image: '',
      blog_article: '',
      blog_category: '',
      image_url_uploaded: ''
    },
    validationSchema: Yup.object({
      blog_title: Yup.string().required('Title is Required'),
      blog_category: Yup.string().required('Category is Required'),
      blog_image: Yup.string().required('Image is Required'),
      blog_article: Yup.string().required('Field is Required')
    }),
    onSubmit: (val) => {
      const payload = {
        blog_title: val.blog_title,
        blog_image: val.image_url_uploaded,
        blog_article: val.blog_article,
        blog_category: val.blog_category
      }

      if (paramsURL) {
        handleEditBlog(payload)
      } else {
        handleAddBlog(payload)
      }
    }
  })

  const handleAddBlog = async(payload) => {
    setisLoading(true)

    try {
      const { status } = await _axios.post('/api/blogs', payload)
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        message.success('Menambah Blog Sukses!.', 2, () => navigate('/blog'))
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const handleEditBlog = async(payload) => {
    setisLoading(true)
    const { state } = location

    try {
      const { status } = await _axios.put(`/api/blogs/${state.id}`, payload)
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        message.success('Mengubah Blog Sukses!.', 2, () => navigate(`/blog`))
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const handleChangeUpload = (info) => {
    getBase64(info.fileList[0].originFileObj, async (imageUrl) => {
      const payload = {
        image_name: info.file.name,
        image_data: imageUrl.split(',')[1]
      }

      setFieldValue('blog_image', imageUrl)
      setisUploading(true)

      try {
        const { data: { data: { Data } }, status } = await _axios.post('/api/blogs/upload/image', payload)
        if (RESPONSE_STATUS.includes(status)) {
          setFieldValue('image_url_uploaded', Data)
          setisUploading(false)
        }
      } catch (error) {
        setisUploading(false)
        message.error(getErrorMessage(error))
      }
    })
  }

  const beforeUploadImage = (file) => {
    const isJpgOrPng = ['image/jpeg', 'image/png'].includes(file.type)
    const sizeAllowed = file.size / 1024 / 1024 < 2 // 2MB

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!', 5);
    }

    if (!sizeAllowed) {
      message.error('Image must smaller than 2MB!');
    }

    return false
  }

  return (
    <>
      <Main title={paramsURL ? 'Edit Blog' : 'Add Blog'}>
        <Breadcrumb nav={nav} />
        <Form className='blog-form'>
          <Form.Item label='Title'>
            <Input
              name='blog_title'
              type='text'
              value={values.blog_title}
              onChange={handleChange}
              placeholder='petani muda berdikasi tinggi...'
              className={errors.blog_title && touched.blog_title && 'is-invalid'}
              disabled={isLoading}
            />
            {errors.blog_title && touched.blog_title &&
              <TextError>{errors.blog_title}</TextError>
            }
          </Form.Item>

          <Form.Item label='Category'>
            <Select
              value={values.blog_category}
              onChange={(val) => setFieldValue('blog_category', val)}
              className={errors.blog_category && touched.blog_category && 'is-invalid'}
              disabled={isLoading}
            >
              {blogCategory.map(({ value, label }, i) =>
                <Option value={value} key={i}>{label}</Option>
              )}
            </Select>
            {errors.blog_category && touched.blog_category &&
              <TextError>{errors.blog_category}</TextError>
            }
          </Form.Item>

          <Form.Item label='Image'>
            {!values.blog_image ? (
              <div className='wrapper-error-boundary'>
                <Upload
                  className="uploader"
                  showUploadList={false}
                  beforeUpload={(info) => beforeUploadImage(info)}
                  onChange={(info) => handleChangeUpload(info)}
                  disabled={isUploading || isLoading}
                >
                  <div>
                    <CloudUploadOutlined />
                    <h3 className='ant-upload-text'>Unggah</h3>
                  </div>
                </Upload>
                {errors.blog_image && touched.blog_image &&
                  <TextError>{errors.blog_image}</TextError>
                }
              </div>
            ) : (
              <div className='image-wrapper'>
                <img
                  alt='blog'
                  src={values.blog_image}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null // prevents looping
                    currentTarget.src =
                      'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
                  }}
                  onClick={() => openImageViewer([values.blog_image])}
                />
                <CloseCircleOutlined className='close_sign' onClick={() => {
                  setFieldValue('blog_image', '')
                  setFieldValue('image_url_uploaded', '')
                }} />
              </div>
            )}
          </Form.Item>

          <Form.Item label='Article'>
            <CKEditor
              disabled={isLoading}
              editor={ ClassicEditor }
              data=""
              onReady={ editor => {
                // You can store the "editor" and use when it is needed.
              }}
              onChange={ ( event, editor ) => {
                const data = editor.getData();
                setFieldValue('blog_article', data)
              }}
            />
            {errors.blog_article && touched.blog_article &&
              <TextError>{errors.blog_article}</TextError>
            }
          </Form.Item>

          <Button loading={isLoading} type='primary' onClick={handleSubmit}>Submit</Button>
        </Form>
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

export default FormBlog