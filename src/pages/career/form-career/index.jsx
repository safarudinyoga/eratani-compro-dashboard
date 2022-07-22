/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, Input, message, Select, DatePicker } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import moment from 'moment'

import Breadcrumb from '../../../components/breadcrumb'
import Main from '../../../components/main';
import '../career.sass'
import TextError from '../../../components/error-message';
import { getErrorMessage, RESPONSE_STATUS } from '../../../utils/apiHelper';
import { _axios } from '../../../utils/_axios';

const { Option } = Select;

const FormCareer = () => {
  const location = useLocation()
  const { url: paramsURL } = useParams()
  const navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false)

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
    setisLoading(true)

    try {
      const { data: { data }, status } = await _axios.get(`https://compro-api.eratani.co.id/api/jobs/url/${paramsURL}`)
      if (RESPONSE_STATUS.includes(status)) {
        setValues({
          job_title: data.job_title,
          job_level: data.job_level,
          job_type: data.job_type,
          job_category: data.job_category,
          job_location: data.job_location,
          job_experience: data.job_experience,
          job_application_deadline: moment(data.job_application_deadline),
          job_requirements: data.job_requirements,
          job_responsibilities: data.job_responsibilities,
          job_benefits: data.job_benefits,
          job_link_url: data.job_link_url
        })
        setisLoading(false)
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
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
      job_application_deadline: '',
      job_requirements: "",
      job_responsibilities: "",
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
      job_responsibilities: Yup.string().required('Field is Required'),
      job_benefits: Yup.string().required('Field is Required'),
      job_link_url: Yup.string().required('Field is Required')
    }),
    onSubmit: (val) => {
      const payload = { ...val, job_experience: Number(val.job_experience) }

      if (paramsURL) {
        handleEditCareer(payload)
      } else {
        handleAddCareer(payload)
      }
    }
  })

  const handleAddCareer = async(payload) => {
    setisLoading(true)

    try {
      const { status } = await _axios.post('/api/jobs', payload)
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        message.success('Menambah Job Sukses!.', 2, () => navigate('/career'))
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const handleEditCareer = async(payload) => {
    setisLoading(true)
    const { state } = location

    try {
      const { status } = await _axios.put(`/api/jobs/${state.id}`, payload)
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        message.success('Mengubah Job Sukses!.', 2, () => navigate('/career'))
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          {errors.job_level && touched.job_level &&
            <TextError>{errors.job_level}</TextError>
          }
        </Form.Item>
        <Form.Item label='Job Type'>
          <Select
            value={values.job_type}
            onChange={(val) => setFieldValue('job_type', val)}
            disabled={isLoading}
          >
            {jobTypeOption.map(({ value, label }, i) =>
              <Option value={value} key={i}>{label}</Option>
            )}
          </Select>
          {errors.job_type && touched.job_type &&
            <TextError>{errors.job_type}</TextError>
          }
        </Form.Item>
        <Form.Item label='Job Category'>
          <Select
            value={values.job_category}
            onChange={(val) => setFieldValue('job_category', val)}
            disabled={isLoading}
          >
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          {errors.job_application_deadline && touched.job_application_deadline &&
            <TextError>{errors.job_application_deadline}</TextError>
          }
        </Form.Item>
        <Form.Item label='Requirements'>
          <CKEditor
            disabled={isLoading}
            editor={ ClassicEditor }
            data={values.job_requirements}
            onReady={ editor => {
              // You can store the "editor" and use when it is needed.
            }}
            onChange={ ( event, editor ) => {
              const data = editor.getData();
              setFieldValue('job_requirements', data)
            }}
          />
          {errors.job_requirements && touched.job_requirements &&
            <TextError>{errors.job_requirements}</TextError>
          }
        </Form.Item>
        <Form.Item label='Responsibilities'>
          <CKEditor
            disabled={isLoading}
            editor={ ClassicEditor }
            data={values.job_responsibilities}
            onReady={ editor => {
              // You can store the "editor" and use when it is needed.
            }}
            onChange={ ( event, editor ) => {
              const data = editor.getData();
              setFieldValue('job_responsibilities', data)
            }}
          />
          {errors.job_responsibilities && touched.job_responsibilities &&
            <TextError>{errors.job_responsibilities}</TextError>
          }
        </Form.Item>
        <Form.Item label='Benefits'>
          <CKEditor
            disabled={isLoading}
            editor={ ClassicEditor }
            data={values.job_benefits}
            onReady={ editor => {
              // You can store the "editor" and use when it is needed.
            }}
            onChange={ ( event, editor ) => {
              const data = editor.getData();
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
            disabled={isLoading}
          />
          {errors.job_link_url && touched.job_link_url &&
            <TextError>{errors.job_link_url}</TextError>
          }
        </Form.Item>

        <Button loading={isLoading} type='primary' onClick={handleSubmit}>Submit</Button>
      </Form>
    </Main>
  )
}

export default FormCareer