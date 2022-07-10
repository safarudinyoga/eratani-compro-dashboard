export const RESPONSE_STATUS = [200, 201, 202, 203, 204]

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