import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, Input, message, Select, DatePicker } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import '../career.sass'
import TextError from '../../../components/error-message';
import { config, getErrorMessage, RESPONSE_STATUS } from '../../../utils/apiHelper';
import dayjs from 'dayjs';

const { Option } = Select;

const FormCareer = props => {
  const { url: paramsURL } = useParams()
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

  useEffect(() => {
    if (!paramsURL) return

    fetchDetail()
  }, [])

  const fetchDetail = async() => {
    try {
      const { data: { data }, status } = await axios.get(`https://compro-api.eratani.co.id/api/jobs/url/${paramsURL}`)
      if (RESPONSE_STATUS.includes(status)) {
        setValues({
          job_title: data.job_title,
          job_level: data.job_level,
          job_type: data.job_type,
          job_category: data.job_category,
          job_location: data.job_location,
          job_experience: data.job_experience,
          // job_application_deadline: dayjs(data.job_application_deadline || '').format('DD-MM-YYYY'),
          job_requirements: data.job_requirements,
          job_benefits: data.job_benefits,
          job_link_url: data.job_link_url
        })
      }
    } catch (error) {

    }
  }


  const { handleChange, handleSubmit, setFieldValue, setValues,values, errors, touched } = useFormik({
    initialValues: {
      job_title: "",
      job_level: "",
      job_type: "",
      job_category: "",
      job_location: "",
      job_experience: "",
      job_application_deadline: "",
      job_requirements: "",
      job_benefits: "",
      job_link_url: ""
    },
    validationSchema: Yup.object({
      job_title: Yup.string().required('Field is Required'),
      job_level: Yup.string().required('Field is Required'),
      job_type: Yup.string().required('Field is Required'),
      job_category: Yup.string().required('Field is Required'),
      job_location: Yup.string().required('Field is Required'),
      job_experience: Yup.string().required('Field is Required'),
      job_application_deadline: Yup.string().required('Field is Required'),
      job_requirements: Yup.string().required('Field is Required'),
      job_benefits: Yup.string().required('Field is Required'),
      job_link_url: Yup.string().required('Field is Required')
    }),
    onSubmit: (val) => {
      console.log(val);
    }
  })

  useEffect(() => {
    console.log({ values, errors });
  }, [values, errors])

  const jobTypeOption = [
    {
      label: 'Fulltime',
      value: 'fulltime'
    },
    {
      label: 'Parttime',
      value: 'parttime'
    },
  ]

  const jobCategoryOption = [
    {
      label: 'Finance & Accounting',
      value: 'finance_accounting',
    },
    {
      label: 'Product & Design',
      value: 'product_design',
    },
    {
      label: 'Technology & Development',
      value: 'tech_development',
    },
    {
      label: 'Human Resources',
      value: 'human_resources',
    },
    {
      label: 'Farmer Acquisition',
      value: 'farmer_acquisition',
    },
  ]

  return (
    <Main title='Add Career'>
      <Breadcrumb nav={nav} />
      <Form className='career-form'>
        <Form.Item label='Title'>
          <Input
            name='job_title'
            type='text'
            value={values.job_title}
            onChange={handleChange}
            placeholder='title'
            className={errors.job_title && touched.job_title && 'is-invalid'}
          />
          {errors.job_title && touched.job_title &&
            <TextError>{errors.job_title}</TextError>
          }
        </Form.Item>
        <Form.Item label='Level'>
          <Input
            name='job_level'
            type='text'
            value={values.job_level}
            onChange={handleChange}
            placeholder='level'
            className={errors.job_level && touched.job_level && 'is-invalid'}
          />
          {errors.job_level && touched.job_level &&
            <TextError>{errors.job_level}</TextError>
          }
        </Form.Item>
        <Form.Item label='Job Type'>
          <Select value={values.job_type} onChange={(val) => setFieldValue('job_type', val)}>
            {jobTypeOption.map(({ value, label }, i) =>
              <Option value={value} key={i}>{label}</Option>
            )}
          </Select>
          {errors.job_type && touched.job_type &&
            <TextError>{errors.job_type}</TextError>
          }
        </Form.Item>
        <Form.Item label='Job Category'>
          <Select value={values.job_category} onChange={(val) => setFieldValue('job_category', val)}>
            {jobCategoryOption.map(({ value, label }, i) =>
              <Option value={value} key={i}>{label}</Option>
            )}
          </Select>
          {errors.job_category && touched.job_category &&
            <TextError>{errors.job_category}</TextError>
          }
        </Form.Item>
        <Form.Item label='Location'>
          <Input
            name='job_location'
            type='text'
            value={values.job_location}
            onChange={handleChange}
            placeholder='location'
            className={errors.job_location && touched.job_location && 'is-invalid'}
          />
          {errors.job_location && touched.job_location &&
            <TextError>{errors.job_location}</TextError>
          }
        </Form.Item>
        <Form.Item label='Experience'>
          <Input
            name='job_experience'
            type='text'
            value={values.job_experience}
            onChange={handleChange}
            placeholder='experience'
            className={errors.job_experience && touched.job_experience && 'is-invalid'}
          />
          {errors.job_experience && touched.job_experience &&
            <TextError>{errors.job_experience}</TextError>
          }
        </Form.Item>
        <Form.Item label='Deadline Application'>
          <DatePicker
            name='job_application_deadline'
            value={values.job_application_deadline}
            onChange={(e) => setFieldValue('job_application_deadline', e)}
            className={errors.job_application_deadline && touched.job_application_deadline && 'is-invalid'}
            format='DD-MM-YYYY'
          />
          {errors.job_application_deadline && touched.job_application_deadline &&
            <TextError>{errors.job_application_deadline}</TextError>
          }
        </Form.Item>
        <Form.Item label='Requirements'>
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
              setFieldValue('job_requirements', data)
            }}
          />
          {errors.job_requirements && touched.job_requirements &&
            <TextError>{errors.job_requirements}</TextError>
          }
        </Form.Item>
        <Form.Item label='Benefits'>
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
              setFieldValue('job_benefits', data)
            }}
            className='is-invalid'
          />
          {errors.job_benefits && touched.job_benefits &&
            <TextError>{errors.job_benefits}</TextError>
          }
        </Form.Item>
        <Form.Item label='Link URL'>
          <Input
            name='job_link_url'
            type='text'
            value={values.job_link_url}
            onChange={handleChange}
            placeholder='experience'
            className={errors.job_link_url && touched.job_link_url && 'is-invalid'}
          />
          {errors.job_link_url && touched.job_link_url &&
            <TextError>{errors.job_link_url}</TextError>
          }
        </Form.Item>

        <Button type='primary' onClick={handleSubmit}>Submit</Button>
      </Form>
    </Main>
  )
}

FormCareer.propTypes = {}

export default FormCareer