import { Typography, Table, Row, Button, Space } from 'antd'
import { useEffect, useState } from 'react'
import { getPublishedThemes } from '../../api/theme'

const SelectPresetThemeForm = () => {
  const [publishedThemes, setPublishedThemes] = useState([])

  useEffect(() => {
    const fetchPublishedThemes = async () => {
      const res = await getPublishedThemes()
      if (res.status === 200) {
        setPublishedThemes(res.data)
      }
    }
    fetchPublishedThemes()
  }, [])

  const columns = [
    {
      title: 'Theme Name',
      dataIndex: 'name',
      key: 'creator',
      align: 'center',
      render: (_, theme) => {
        return <Button onClick={console.log}>{theme.name}</Button>
      }
    },
    { title: 'Creator', dataIndex: 'creator', key: 'creator', align: 'center' }
  ]

  return (
    <Space direction="vertical" size="large" align="center" className="w-100">
      <Row justify="start" className="mb-3">
        <Typography.Title level={5}>Choose user defined theme</Typography.Title>
      </Row>
      <Table columns={columns} dataSource={publishedThemes} />
    </Space>
  )
}

export default SelectPresetThemeForm
