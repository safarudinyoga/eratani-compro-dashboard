/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react'
import ImageViewer from "react-simple-image-viewer";
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { LeftOutlined, CloudUploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, Input, message, Upload, DatePicker } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import moment from 'moment'

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import '../event.sass'
import TextError from '../../../components/error-message';
import { _axios } from '../../../utils/_axios';
import { getErrorMessage, RESPONSE_STATUS } from '../../../utils/apiHelper';

const FormEvent = () => {
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

  const { handleChange, handleSubmit, setFieldValue, setValues, values, errors, touched } = useFormik({
    initialValues: {
      event_title: "",
      event_image: "",
      event_location_title: "",
      event_location_subtitle: "",
      event_article: "",
      event_start: "",
      image_url_uploaded: '',
    },
    validationSchema: Yup.object({
      event_title: Yup.string().required('Title is Required'),
      event_image: Yup.string().required('Title is Required'),
      event_location_title: Yup.string().required('Title is Required'),
      event_location_subtitle: Yup.string().required('Title is Required'),
      event_article: Yup.string().required('Title is Required'),
      event_start: Yup.string().required('Title is Required'),
    }),
    onSubmit: (val) => {

      const payload = {
        event_title: val.event_title,
        event_image: val.image_url_uploaded,
        event_location_title: val.event_location_title,
        event_location_subtitle: val.event_location_subtitle,
        event_article: val.event_article,
        event_start: val.event_start,
      }

      if (paramsURL) {
        handleEditEvent(payload)
      } else {
        handleAddEvent(payload)
      }
    }
  })

  useEffect(() => {
    if (!paramsURL) return

    fetchDetailForm()
  }, [])

  const fetchDetailForm = async() => {
    setisLoading(true)

    try {
      const { data: { data }, status } = await _axios.get(`/api/events/url/${paramsURL}`)
      if (RESPONSE_STATUS.includes(status)) {
        setValues({
          event_title : data.event_title,
          event_image : data.event_image,
          event_location_title : data.event_location_title,
          event_location_subtitle : data.event_location_subtitle,
          event_article : data.event_article,
          event_start : moment(data.event_start)
        })
        setisLoading(false)
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const handleAddEvent = async(payload) => {
    setisLoading(true)

    try {
      const { status } = await _axios.post('/api/events', payload)
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        message.success('Menambah Agenda Sukses!.', 2, () => navigate('/event'))
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const handleEditEvent = async(payload) => {
    setisLoading(true)
    const { state } = location

    try {
      const { status } = await _axios.put(`/api/events/${state.id}`, payload)
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        message.success('Mengubah Agenda Sukses!.', 2, () => navigate(`/event`))
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

      setFieldValue('event_image', imageUrl)
      setisUploading(true)

      try {
        const { data: { data: { Data } }, status } = await _axios.post('/api/events/upload/image', payload)
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

    return false;
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
          <Form.Item label='Event Location Title'>
            <Input
              name='event_location_title'
              type='text'
              value={values.event_location_title}
              onChange={handleChange}
              placeholder='tips'
              className={errors.event_location_title && touched.event_location_title && 'is-invalid'}
            />
            {errors.event_location_title && touched.event_location_title &&
              <TextError>{errors.event_location_title}</TextError>
            }
          </Form.Item>
          <Form.Item label='Event Location Subtitle'>
            <Input
              name='event_location_subtitle'
              type='text'
              value={values.event_location_subtitle}
              onChange={handleChange}
              placeholder='tips'
              className={errors.event_location_subtitle && touched.event_location_subtitle && 'is-invalid'}
            />
            {errors.event_location_subtitle && touched.event_location_subtitle &&
              <TextError>{errors.event_location_subtitle}</TextError>
            }
          </Form.Item>
          <Form.Item label='Image'>
            {!values.event_image ? (
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
                {errors.event_image && touched.event_image &&
                  <TextError>{errors.event_image}</TextError>
                }
              </div>
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
              data={values.event_article}
              onReady={ editor => {
                // You can store the "editor" and use when it is needed.
              }}
              onChange={ ( event, editor ) => {
                const data = editor.getData();
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

export default FormEvent