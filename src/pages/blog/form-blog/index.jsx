import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ImageViewer from "react-simple-image-viewer";
import { useNavigate ,useParams } from 'react-router-dom'
import { LeftOutlined, InboxOutlined } from '@ant-design/icons';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, Input, Upload } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import '../blog.sass'
import TextError from '../../../components/error-message';

const FormBlog = props => {
  const navigate = useNavigate();

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

  const { handleChange, handleSubmit, setFieldValue, values, errors, touched } = useFormik({
    initialValues: {
      blog_title: '',
      blog_image: '',
      blog_article: '',
      blog_category: ''
    },
    validationSchema: Yup.object({
      blog_title: Yup.string().required('Title is Required'),
      blog_category: Yup.string().required('Category is Required'),
    })
  })

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    console.log({ values, errors });
  }, [values, errors])

  return (
    <Main title='Add Blog'>
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

        <Form.Item label="Dragger">
          <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
            <Upload.Dragger name="files" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload.</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>

        <Form.Item label='Article'>
          <CKEditor
            editor={ ClassicEditor }
            data="<p>Hello from CKEditor 5!</p>"
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
  )
}

FormBlog.propTypes = {}

export default FormBlog