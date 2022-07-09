import axios from 'axios'

export const _axios = axios.create({ baseURL: 'http://192.168.10.207:3000' });
_axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJVU1ItMjEiLCJlbWFpbCI6ImNvbXByb2FkbWluQGVyYXRhbmkuY28uaWQiLCJmdWxsX25hbWUiOiJUZXN0IiwidXNlcl9waG9uZV9udW1iZXIiOiIwODEyMyIsInByaXZpbGVnZXMiOlsiQ09NUFJPX0JMT0dfQUREIiwiQ09NUFJPX0JMT0dfRURJVCIsIkNPTVBST19FVkVOVF9BREQiLCJDT01QUk9fRVZFTlRfRURJVCIsIkNPTVBST19KT0JfQUREIiwiQ09NUFJPX0pPQl9FRElUIiwiQ09NUFJPX0JMT0dfREVMRVRFIiwiQ09NUFJPX0VWRU5UX0RFTEVURSIsIkNPTVBST19KT0JfREVMRVRFIiwiQ09NUFJPX0JMT0dfVVBMT0FEX0lNQUdFIiwiQ09NUFJPX0VWRU5UX1VQTE9BRF9JTUFHRSJdLCJleHAiOjE2NTcyNzQyMDksImlzX3JlZnJlc2hfdG9rZW4iOmZhbHNlfQ.H_ymdWGaL4vGRlutrvYlcYvx6UDxwQsR-Q_WN431hDM`;

export const RESPONSE_STATUS = [200, 201, 202, 203, 204]

export const config = () => {
  return {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NvZGUiOiJVU1ItMjEiLCJlbWFpbCI6ImNvbXByb2FkbWluQGVyYXRhbmkuY28uaWQiLCJmdWxsX25hbWUiOiJUZXN0IiwidXNlcl9waG9uZV9udW1iZXIiOiIwODEyMyIsInByaXZpbGVnZXMiOlsiQ09NUFJPX0JMT0dfQUREIiwiQ09NUFJPX0JMT0dfRURJVCIsIkNPTVBST19FVkVOVF9BREQiLCJDT01QUk9fRVZFTlRfRURJVCIsIkNPTVBST19KT0JfQUREIiwiQ09NUFJPX0pPQl9FRElUIiwiQ09NUFJPX0JMT0dfREVMRVRFIiwiQ09NUFJPX0VWRU5UX0RFTEVURSIsIkNPTVBST19KT0JfREVMRVRFIiwiQ09NUFJPX0JMT0dfVVBMT0FEX0lNQUdFIiwiQ09NUFJPX0VWRU5UX1VQTE9BRF9JTUFHRSJdLCJleHAiOjE2NTcyNzQyMDksImlzX3JlZnJlc2hfdG9rZW4iOmZhbHNlfQ.H_ymdWGaL4vGRlutrvYlcYvx6UDxwQsR-Q_WN431hDM`
    }
  }
}

export const getErrorMessage = (err, defaultMessage = 'Terjadi kesalahan') => {
  let errorMessage = ''

  if (err instanceof Error) {
    const { response } = err

    if (typeof response === 'object') {
      if (response.hasOwnProperty('data')) {
        const { message } = response.data
        errorMessage = message
      }
    } else {
      const { message } = err

      switch (message) {
        case 'Network Error':
          errorMessage = 'Mohon periksa koneksi internet Anda'
          break
        default:
          errorMessage = defaultMessage
      }
    }
  }

  return errorMessage
}