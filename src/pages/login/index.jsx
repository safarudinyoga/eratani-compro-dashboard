import { useState } from 'react'
import { Form, Input, Button, Icon, message } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';

// components & styles
import logo from '../../assets/logo.svg'
import './login.sass'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [viewPassword, setViewPassword] = useState(false)

  const { handleChange, handleSubmit, values, touched, errors } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Field harus diisi!'),
      password: Yup.string().required('Field harus diisi!')
    }),
    onSubmit: (val) => {

    }
  })

  return (
    <div className='login'>
      <div className='login_inner'>
        <img src={logo} alt='company-logo' width={200} />
        <h2 className='login_title'>Dari Petani untuk Petani</h2>
        <p>Silahkan log in ke akun Anda</p>
        <Form>
          <Form.Item>
            <Input
              name='email'
              id='email'
              type='email'
              placeholder='email'
              value={values.email}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Input
              name='password'
              id='password'
              type={viewPassword ? 'text' : 'password'}
              placeholder='password'
              onChange={handleChange}
              value={values.password}
              addonAfter={
                viewPassword ? <EyeFilled onClick={() => setViewPassword(!viewPassword)} /> : <EyeInvisibleFilled onClick={() => setViewPassword(!viewPassword)} />
              }
            />
          </Form.Item>
          <Button
            type='primary'
            loading={isLoading}
          >
            LOG IN
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Login