import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import ImageViewer from "react-simple-image-viewer";
import { useNavigate, useParams } from 'react-router-dom'
import { LeftOutlined, CloudUploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, Input, message, Upload } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import '../blog.sass'
import TextError from '../../../components/error-message';
import { config, getErrorMessage, RESPONSE_STATUS } from '../../../utils/apiHelper';

const FormBlog = props => {
  const navigate = useNavigate();
  const { url: paramsURL } = useParams()
  const [isUploading, setisUploading] = useState(false)

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
  console.log(paramsURL);

  useEffect(() => {
    if (!paramsURL) return


    fetchDetail()
  }, [])

  const fetchDetail = async() => {
    try {
      const { data: { data }, status } = await axios.get(`https://compro-api.eratani.co.id/api/blogs/url/${paramsURL}`)
      if (RESPONSE_STATUS.includes(status)) {
        setValues({
          blog_title: data.blog_title,
          blog_image: data.blog_image,
          blog_article: data.blog_article,
          blog_category: data.blog_category
        })
      }
    } catch (error) {
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

  const { handleChange, handleSubmit, setFieldValue, values, errors, touched, setValues } = useFormik({
    initialValues: {
      blog_title: '',
      blog_image: '',
      blog_article: '',
      blog_category: ''
    },
    validationSchema: Yup.object({
      blog_title: Yup.string().required('Title is Required'),
      blog_category: Yup.string().required('Category is Required'),
    }),
    onSubmit: (val) => {
      console.log(val);
    }
  })

  useEffect(() => {
    console.log({ values, errors });
  }, [values, errors])

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const handleChangeUpload = (info) => {
    if (info.file.status === 'uploading') {
      setisUploading(true)
      info.file.status = 'done'
      return
    }

    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setFieldValue('blog_image', imageUrl)
        setisUploading(false)
      })
    }
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

    setisUploading(false)

    return isJpgOrPng && sizeAllowed;
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
            />
            {errors.blog_title && touched.blog_title &&
              <TextError>{errors.blog_title}</TextError>
            }
          </Form.Item>

          <Form.Item label='Category'>
            <Input
              name='blog_category'
              type='text'
              value={values.blog_category}
              onChange={handleChange}
              placeholder='tips'
              className={errors.blog_category && touched.blog_category && 'is-invalid'}
            />
            {errors.blog_category && touched.blog_category &&
              <TextError>{errors.blog_category}</TextError>
            }
          </Form.Item>

          <Form.Item label='Image'>
            {!values.blog_image ? (
              <Upload
                className="uploader"
                showUploadList={false}
                beforeUpload={(info) => beforeUploadImage(info)}
                onChange={(info) => handleChangeUpload(info)}
                disabled={isUploading}
              >
                <div>
                  <CloudUploadOutlined />
                  <h3 className='ant-upload-text'>Unggah</h3>
                </div>
              </Upload>
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
                <CloseCircleOutlined className='close_sign' onClick={() => setFieldValue('blog_image', null)} />
              </div>
            )}
          </Form.Item>

          <Form.Item label='Article'>
            <CKEditor
              editor={ ClassicEditor }
              data=""
              onReady={ editor => {
                // You can store the "editor" and use when it is needed.
                // console.log( 'Editor is ready to use!', editor );
              }}
              onChange={ ( event, editor ) => {
                const data = editor.getData();
                // console.log( { event, editor, data } );
                setFieldValue('blog_article', data)
              }}
            />
          </Form.Item>

          <Button type='primary' onClick={handleSubmit}>Submit</Button>
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

FormBlog.propTypes = {}

export default FormBlog