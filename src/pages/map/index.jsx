import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, message, Select, Switch } from 'antd'
import TableControl from '../../components/table-control'
import TablePagination from '../../components/table-pagination'

import Main from '../../components/main'
import './map.sass'
import { _axios } from '../../utils/_axios'
import { getErrorMessage, RESPONSE_STATUS } from '../../utils/apiHelper'

const columns = (data, fetchDataCity, city, setCity, isLoading) => [
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
    render: (_, { nama, id }) => {
      const dataRow = data.find(({ province }) => province === nama)
      const cities = dataRow?.cities?.map(({ nama }) => ({ label: nama, value: nama }))
      const isDisabled = !data.map(({ province }) => province).includes(nama)
      const options = [...city]

      return (
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          value={cities}
          onChange={(e) => console.log(e)}
          options={options}
          loading={isLoading}
          onFocus={() => fetchDataCity(id)}
          onBlur={() => setCity([])}
          disabled={isDisabled}
        />
      )
    }
  },
  {
    title: 'Active',
    dataIndex: 'status',
    key: 'status',
    render: (_, { nama }) => {
      const isChecked = data.map(({ province }) => province).includes(nama)

      return (
        <Switch checkedChildren="Yes" unCheckedChildren="No" checked={isChecked} />
      )
    }
  },
  {
    title: 'Coming Soon (?)',
    dataIndex: 'comingSoon',
    key: 'comingSoon',
    render: (_, { nama }) => {
      const isChecked = data.find(({ province }) => province === nama)?.coming_soon

      return (
        <Switch checkedChildren="Yes" unCheckedChildren="No" checked={isChecked} />
      )
    }
  },
]

const MapManagement = props => {
  const [isLoading, setisLoading] = useState(false)
  const [isOptionLoading, setisOptionLoading] = useState(false)
  const [province, setProvince] = useState([])
  const [city, setCity] = useState([])
  const [data, setData] = useState([])

  useEffect(() => {
    fetchDataProvince()
    handleFetchData()
  }, [])

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
    setisLoading(true)

    try {
      const { status, data: { provinsi } } = await _axios.get('https://dev.farizdotid.com/api/daerahindonesia/provinsi')
      if (RESPONSE_STATUS.includes(status)) {
        setProvince(provinsi)
        setisLoading(false)
      }
    } catch (error) {
      setisLoading(false)
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

  return (
    <Main title='Map Management'>
      <TableControl />
      <Table
        loading={isLoading}
        dataSource={province}
        pagination={false}
        columns={columns(data, fetchDataCity, city, setCity, isOptionLoading)}
        className='event_table'
        rowKey="id"
        key="id"
      />
    </Main>
  )
}

MapManagement.propTypes = {}

export default MapManagement