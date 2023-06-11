import { Typography, Table, Row, Button, Space } from 'antd'
import { useEffect, useState } from 'react'
import { getPublishedThemes } from '../../api/theme'
import useMessage from 'antd/es/message/useMessage'
import { editTheme, editThemeIcon } from '../../api/theme'
import { useDispatch } from 'react-redux'
import { setColorTheme, setIconTheme } from '../../store/theme/themeSlice'

const SelectPresetThemeForm = () => {
  const [publishedThemes, setPublishedThemes] = useState([])
  const [messageApi, contextHolder] = useMessage()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPublishedThemes = async () => {
      const res = await getPublishedThemes()
      if (res.status === 200) {
        const data = res.data.map((el, i) => ({ ...el, key: i }))
        setPublishedThemes(data)
      }
    }
    fetchPublishedThemes()
  }, [])

  const presignedUrlToKey = (url) => {
    const regex = new RegExp('.*.com\\/*(.*\\/.*)\\?.*', 'gm')
    const matches = regex.exec(url)
    return matches.length > 1 ? matches[1] : null
  }

  const handleThemeSelect = async (theme) => {
    try {
      const { id, name, creator, ...fieldsToChange } = theme
      Object.keys(fieldsToChange).forEach(async (key) => {
        if (key.includes('color')) {
          const res = await editTheme({ [key]: fieldsToChange[key] })
          if (res.status === 200) dispatch(setColorTheme({ [key]: fieldsToChange[key] }))
        } else if (key === 'cursor' || key.includes('item') || key.includes('target')) {
          const imageKey = presignedUrlToKey(fieldsToChange[key])
          if (imageKey) {
            const res = await editThemeIcon({ [key]: imageKey })
            if (res.status === 200) {
              const {
                upload_url = null,
                download_url = null,
                delete_url = null,
                ...rest
              } = res.data
              dispatch(setIconTheme({ field: key, url: download_url }))
            }
          }
        }
      })
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const columns = [
    {
      title: 'Theme Name',
      dataIndex: 'name',
      key: 'creator',
      align: 'center',
      render: (_, theme) => {
        return <Button onClick={() => handleThemeSelect(theme)}>{theme.name}</Button>
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
