import { useState, useEffect } from 'react'
import { Table, message, Select, Switch } from 'antd'
import TableControl from '../../components/table-control'
import { CloseCircleOutlined } from '@ant-design/icons';

import Main from '../../components/main'
import './map.sass'
import { _axios } from '../../utils/_axios'
import { getErrorMessage, RESPONSE_STATUS } from '../../utils/apiHelper'

const dummyPOS = [
  // sumatera
  {
      prov: 'Aceh',
      pos: { x: 73, y: 86},
  },
  {
      prov: 'Sumatera Utara',
      pos: { x: 118, y: 147},
  },
  {
      prov: 'Sumatera Barat',
      pos: { x: 153, y: 220},
  },
  {
      prov: 'Riau',
      pos: { x: 185, y: 190},
  },
  {
      prov: 'Jambi',
      pos: { x: 220, y: 255},
  },
  {
      prov: 'Sumatera Selatan',
      pos: { x: 250, y: 299},
  },
  {
      prov: 'Lampung',
      pos: { x: 288, y: 345},
  },
  {
      prov: 'Bengkulu',
      pos: { x: 200, y: 305},
  },
  {
      prov: 'Kepulauan Bangka Belitung',
      pos: { x: 310, y: 270},
  },

  // Sulawesi
  {
      prov: 'Sulawesi Utara',
      pos: { x: 830, y: 190},
  },
  {
      prov: 'Gorontalo',
      pos: { x: 770, y: 190},
  },
  {
      prov: 'Sulawesi Tengah',
      pos: { x: 715, y: 245},
  },
  {
      prov: 'Sulawesi Selatan',
      pos: { x: 713, y: 282},
  },
  {
      prov: 'Sulawesi Barat',
      pos: { x: 687, y: 270},
  },
  {
      prov: 'Sulawesi Tenggara',
      pos: { x: 760, y: 310},
  },

  // Kalimantan
  {
      prov: 'Kalimantan Barat',
      pos: { x: 450, y: 220},
  },
  {
      prov: 'Kalimantan Tengah',
      pos: { x: 520, y: 250},
  },
  {
      prov: 'Kalimantan Timur',
      pos: { x: 600, y: 150},
  },
  {
      prov: 'Kalimantan Selatan',
      pos: { x: 580, y: 290},
  },

  // jawa
  {
      prov: 'Banten',
      pos: { x: 305, y: 390},
  },
  {
      prov: 'Dki Jakarta',
      pos: { x: 335, y: 380},
  },
  {
      prov: 'Jawa Barat',
      pos: { x: 366, y: 398},
  },
  {
      prov: 'Jawa Tengah',
      pos: { x: 412, y: 409},
  },
  {
      prov: 'DI Yogyakarta',
      pos: { x: 434, y: 436},
  },
  {
      prov: 'Jawa Timur',
      pos: { x: 485, y: 422},
  },

  {
      prov: 'Bali',
      pos: { x: 570, y: 445},
  },

  {
      prov: 'Nusa Tenggara Barat',
      pos: { x: 630, y: 450},
  },
  {
      prov: 'Nusa Tenggara Timur',
      pos: { x: 730, y: 450},
  },

  // maluku
  {
      prov: 'Maluku Utara',
      pos: { x: 930, y: 190},
  },
  {
      prov: 'Maluku',
      pos: { x: 950, y: 300},
  },

  // Papua
  {
      prov: 'Papua Barat',
      pos: { x: 1070, y: 250},
  },
  {
      prov: 'Papua',
      pos: { x: 1200, y: 300},
  },
]

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
      render: (_, { id, pos }) => {
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
            clearIcon={(<CloseCircleOutlined onClick={() => handleClearAllCities(id, pos)} style={{ fontSize: '13px' }} />)}
          />
        )
      }
    },
    {
      title: 'Active',
      dataIndex: 'status',
      key: 'status',
      render: (_, { nama, id, pos }) => <Switch checkedChildren="Yes" unCheckedChildren="No" checked={handleIsChecked(id)} onChange={(e) => handleChangeActive(e, id, nama, pos)} loading={isLoading} />
    },
    {
      title: 'Coming Soon (?)',
      dataIndex: 'comingSoon',
      key: 'comingSoon',
      render: (_, { id, pos }) => <Switch checkedChildren="Yes" unCheckedChildren="No" checked={handleIsCheckedComingSoon(id)} onChange={(e) => handleChangeComingSoon(e, id, pos)} disabled={handleDisabled(id)} loading={isLoading} />
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
        const remap = provinsi.map(res => dummyPOS.some(dummy => dummy.prov.toLowerCase() === res.nama.toLowerCase()) ? ({ ...res, pos: dummyPOS.filter(dummy => dummy.prov.toLowerCase() === res.nama.toLowerCase()).length ? dummyPOS.find(dummy => dummy.prov.toLowerCase() === res.nama.toLowerCase()).pos : [] }) : ({ ...res, pos: [] }))
        console.log(remap);
        setProvince(remap)
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

  const handleClearAllCities = async (index, pos) => {
    const remapData = data.map(res => res.id === index ? ({ ...res, cities: [], pos }) : ({ ...res, pos }) )
    setisLoading(false)

    const payload = {
      locations: {
        map: [ ...remapData ]
      }
    }

    try {
      const { status } = await _axios.put('/api/locations', payload)
      if (RESPONSE_STATUS.includes(status)) {
        message.success('Berhasil mengupdate map management')
        handleFetchData()
        setisLoading(false)
      }
    } catch (error) {
      setisLoading(false)
      message.error(getErrorMessage(error))
    }

  }

  const handleBlurChangeCities = async (pos) => {
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

  const handleChangeActive = async (e, id, nama, pos) => {
    let tempData = []
    if (!e) {
      tempData = [ ...data ]
      tempData.splice(data.findIndex(res => res.id === id), 1)
    } else {
      tempData = [
        ...data,
        {
          id,
          province: nama,
          pos,
          cities: [],
          coming_soon: false
        }
      ]
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

  const handleChangeComingSoon = async (e, index, pos) => {
    const remapData = data.map((res) => res.id === index ? ({ ...res, coming_soon: e, pos }) : ({ ...res, pos }))

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