import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import ImageViewer from "react-simple-image-viewer";
import { useNavigate } from 'react-router-dom'
import { LeftOutlined, CloudUploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, Input, message, Upload, DatePicker } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import '../event.sass'
import TextError from '../../../components/error-message';

const FormEvent = props => {
  const navigate = useNavigate();
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

  // "event_title" : "Test event title",
  // "event_image" : "Event image url",
  // "event_location" : "Event location string",
  // "event_article" : "Event start",
  // "event_start" : "2022-07-30T12:30:00Z"

  const { handleChange, handleSubmit, setFieldValue, values, errors, touched } = useFormik({
    initialValues: {
      event_title : "",
      event_image : "",
      event_location : "",
      event_article : "",
      event_start : ""
    },
    validationSchema: Yup.object({
      event_title: Yup.string().required('Title is Required'),
      event_image: Yup.string().required('Title is Required'),
      event_location: Yup.string().required('Title is Required'),
      event_article: Yup.string().required('Title is Required'),
      event_start: Yup.string().required('Title is Required'),
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
        setFieldValue('event_image', imageUrl)
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
      <Main title='Add Event'>
        <Breadcrumb nav={nav} />
        <Form className='event-form'>
          <Form.Item label='Title'>
            <Input
              name='event_title'
              type='text'
              value={values.event_title}
              onChange={handleChange}
              placeholder='event title'
              className={errors.event_title && touched.event_title && 'is-invalid'}
            />
            {errors.event_title && touched.event_title &&
              <TextError>{errors.event_title}</TextError>
            }
          </Form.Item>
          <Form.Item label='Event Location'>
            <Input
              name='event_location'
              type='text'
              value={values.event_location}
              onChange={handleChange}
              placeholder='tips'
              className={errors.event_location && touched.event_location && 'is-invalid'}
            />
            {errors.event_location && touched.event_location &&
              <TextError>{errors.event_location}</TextError>
            }
          </Form.Item>
          <Form.Item label='Image'>
            {!values.event_image ? (
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
                  src={values.event_image}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null // prevents looping
                    currentTarget.src =
                      'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
                  }}
                  onClick={() => openImageViewer([values.event_image])}
                />
                <CloseCircleOutlined className='close_sign' onClick={() => setFieldValue('event_image', null)} />
              </div>
            )}
          </Form.Item>
          <Form.Item label='Event Start'>
            <DatePicker
              name='event_start'
              value={values.event_start}
              onChange={(e) => setFieldValue('event_start', e)}
              className={errors.event_start && touched.event_start && 'is-invalid'}
              format='DD-MM-YYYY'
            />
            {errors.event_start && touched.event_start &&
              <TextError>{errors.event_start}</TextError>
            }
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
                setFieldValue('event_article', data)
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

FormEvent.propTypes = {}

export default FormEvent