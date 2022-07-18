import { useState, useEffect } from 'react'
import { Table, message, Select, Switch } from 'antd'
import TableControl from '../../components/table-control'
import { CloseCircleOutlined } from '@ant-design/icons';

import Main from '../../components/main'
import './map.sass'
import { _axios } from '../../utils/_axios'
import { getErrorMessage, RESPONSE_STATUS } from '../../utils/apiHelper'

const MapManagement = props => {
  const [isLoading, setisLoading] = useState(true)
  const [isOptionLoading, setisOptionLoading] = useState(false)
  const [province, setProvince] = useState([])
  const [city, setCity] = useState([])
  const [data, setData] = useState([])

  useEffect(() => {
    fetchDataProvince()
    handleFetchData()
  }, [])

  const columns = () => [
    {
      title: 'Province',
      dataIndex: 'province',
      key: 'province',
      render: (_, { nama }) => nama || '-'
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      width: '65%',
      render: (_, { id }) => {
        const options = [...city]

        return (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            value={selectedCities(id)}
            onChange={(_, option) => handleChangeCities(option, id)}
            options={options}
            loading={isOptionLoading}
            onFocus={() => fetchDataCity(id)}
            onBlur={() => handleBlurChangeCities()}
            onDeselect={(e) => handleDeselectCities(e, id)}
            disabled={handleDisabled(id)}
            allowClear
            clearIcon={(<CloseCircleOutlined onClick={() => handleClearAllCities(id)} style={{ fontSize: '13px' }} />)}
          />
        )
      }
    },
    {
      title: 'Active',
      dataIndex: 'status',
      key: 'status',
      render: (_, { nama, id }) => <Switch checkedChildren="Yes" unCheckedChildren="No" checked={handleIsChecked(id)} onChange={(e) => handleChangeActive(e, id, nama)} loading={isLoading} />
    },
    {
      title: 'Coming Soon (?)',
      dataIndex: 'comingSoon',
      key: 'comingSoon',
      render: (_, { id }) => <Switch checkedChildren="Yes" unCheckedChildren="No" checked={handleIsCheckedComingSoon(id)} onChange={(e) => handleChangeComingSoon(e, id)} disabled={handleDisabled(id)} loading={isLoading} />
    },
  ]

  const handleFetchData = async () => {
    setisLoading(true)

    try {
      const { data: { data: { locations: { map } } }, status } = await _axios.get('/api/locations')
      if (RESPONSE_STATUS.includes(status)) {
        setisLoading(false)
        setData(map)
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const fetchDataProvince = async () => {

    try {
      const { status, data: { provinsi } } = await _axios.get('https://dev.farizdotid.com/api/daerahindonesia/provinsi')
      if (RESPONSE_STATUS.includes(status)) {
        setProvince(provinsi)
      }
    } catch (error) {
      message.error(getErrorMessage(error))
    }
  }

  const fetchDataCity = async (id) => {
    setisOptionLoading(true)

    try {
      const { status, data: { kota_kabupaten } } = await _axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id}`)
      if (RESPONSE_STATUS.includes(status)) {

        setCity(kota_kabupaten.map(res => ({ ...res, label: res.nama, value: res.nama})))
        setisOptionLoading(false)
      }
    } catch (error) {
      setisOptionLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const handleIsChecked = (index) => data.filter(({ id }) => id === index).length
  const handleIsCheckedComingSoon = (index) => data.find(({ id }) => id === index)?.coming_soon
  const handleDisabled = (index) => data.filter(({ id }) => id === index).length <= 0
  const selectedCities = (index) => data.find(({ id }) => id === index)?.cities?.map(({ nama }) => ({ label: nama, value: nama }))
  const handleChangeCities = (all, index) => setData(data.map(res => res.id === index ? ({ ...res, cities: [ ...res.cities, ...all ].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i) }) : res ))
  const handleDeselectCities = (e, index) => setData(data.map((res) => res.id === index ? ({ ...res, cities: res.cities.filter(res => res.value !== e) }) : res))

  const handleClearAllCities = async (index) => {
    const remapData = data.map(res => res.id === index ? ({ ...res, cities: []}) : res )
    setisLoading(false)

    const payload = {
      locations: {
        map: [ ...data.map(res => res.id === index ? ({ ...res, cities: []}) : res ) ]
      }
    }

    try {
      const { status } = await _axios.put('/api/locations', payload)
      if (RESPONSE_STATUS.includes(status)) {
        message.success('Berhasil mengupdate map management')
        setData(remapData)
        handleFetchData()
        setisLoading(false)
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }

  }

  const handleBlurChangeCities = async () => {
    setisLoading(true)

    const payload = {
      locations: {
        map: [ ...data ]
      }
    }

    try {
      const { status } = await _axios.put('/api/locations', payload)
      if (RESPONSE_STATUS.includes(status)) {
        message.success('Berhasil mengupdate map management')
        setCity([])
        handleFetchData()
        setisLoading(false)
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }
  }

  const handleChangeActive = async (e, id, nama) => {
    let tempData = []
    if (!e) {
      tempData = [ ...data ]
      tempData.splice(data.findIndex(res => res.id === id), 1)
      setData(tempData)
    } else {
      tempData = [
        ...data,
        {
          id,
          nama,
          cities: [],
          coming_soon: false
        }
      ]
      setData(tempData)
    }

    const payload = {
      locations: {
        map: tempData
      }
    }

    setisLoading(true)

    try {
      const { status } = await _axios.put('/api/locations', payload)
      if (RESPONSE_STATUS.includes(status)) {
        message.success('Berhasil mengupdate map management')
        setisLoading(false)
        handleFetchData()
        return e
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
      return e
    }
  }

  const handleChangeComingSoon = async (e, index) => {
    const remapData = data.map((res) => res.id === index ? ({ ...res, coming_soon: e }) : res)
    setData(remapData)

    setisLoading(true)

    const payload = {
      locations: {
        map: [ ...remapData ]
      }
    }

    try {
      const { status } = await _axios.put('/api/locations', payload)
      if (RESPONSE_STATUS.includes(status)) {
        message.success('Berhasil mengupdate map management')
        setisLoading(false)
        handleFetchData()
        return e
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
      return e
    }
  }

  return (
    <Main title='Map Management'>
      <TableControl />
      <Table
        loading={isLoading}
        dataSource={province}
        pagination={false}
        columns={columns()}
        className='event_table'
        rowKey="id"
        key="id"
      />
    </Main>
  )
}

export default MapManagement