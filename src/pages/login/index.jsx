import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// components & styles
import logo from '../../assets/logo.svg'
import './login.sass'
import TextError from '../../components/error-message';
import { getErrorMessage, RESPONSE_STATUS } from '../../utils/apiHelper';
import { setCookie, SITE_COOKIES } from '../../utils/cookies';
import { _axios } from '../../utils/_axios';

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [viewPassword, setViewPassword] = useState(false)

  const { handleChange, handleSubmit, values, touched, errors } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email harus diisi!'),
      password: Yup.string().required('Password harus diisi!')
    }),
    onSubmit: (val) => {
      handleSubmitLogin(val)
    }
  })

  const handleSubmitLogin = async(payload) => {
    setIsLoading(true)

    try {
      const { data: { data: { access_token, email, refresh_token } }, status } = await _axios.post('/api/auth/login', payload)
      if (RESPONSE_STATUS.includes(status)) {
        setIsLoading(false)
        setCookie(SITE_COOKIES.ACCESSTOKEN, access_token, 1)
        setCookie(SITE_COOKIES.EMAIL, email, access_token, 1)
        setCookie(SITE_COOKIES.REFRESHTOKEN, refresh_token, access_token, 1)
        navigate('/home')
      }
    } catch (error) {
      setIsLoading(false)
      message.error(getErrorMessage(error, 'Email atau Password anda salah!'))
    }
  }

  return (
    <div className='login' >
      <div className='login_inner'>
        <img src={logo} alt='company-logo' width={200} />
        <h2 className='login_title'>Dari Petani untuk Petani</h2>
        <p>Silahkan log in ke akun Anda</p>
        <form onSubmit={handleSubmit}>
          <Form.Item>
            <Input
              name='email'
              id='email'
              type='email'
              placeholder='email'
              value={values.email}
              onChange={handleChange}
              className={errors.email && touched.email && 'is-invalid'}
            />
            {errors.email && touched.email &&
              <TextError>{errors.email}</TextError>
            }
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
              className={errors.password && touched.password && 'is-invalid'}
            />
            {errors.password && touched.password &&
              <TextError>{errors.password}</TextError>
            }
          </Form.Item>
          <Button
            type='primary'
            loading={isLoading}
            htmlType='submit'
          >
            LOG IN
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login