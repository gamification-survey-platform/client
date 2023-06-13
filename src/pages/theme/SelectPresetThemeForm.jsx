import { Typography, Table, Row, Button, Space } from 'antd'
import { useEffect, useState } from 'react'
import { getPublishedThemes, subscribeToTheme } from '../../api/theme'
import useMessage from 'antd/es/message/useMessage'
import { getTheme } from '../../api/theme'
import { useDispatch, useSelector } from 'react-redux'
import { setColorTheme, setIconTheme, setTheme, setCursor } from '../../store/theme/themeSlice'
import styles from '../../styles/Theme.module.css'
import userSelector from '../../store/user/selectors'

const SelectPresetThemeForm = () => {
  const [publishedThemes, setPublishedThemes] = useState([])
  const [messageApi, contextHolder] = useMessage()
  const dispatch = useDispatch()
  const { level } = useSelector(userSelector)

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

  const handleThemeSelect = async (theme) => {
    try {
      if (level < 2) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 2!'
        })
        return
      }
      const { id, name, creator, ...fieldsToChange } = theme
      const res = await subscribeToTheme(id)
      if (res.status === 200) {
        const res = await getTheme()
        if (res.status === 200) {
          const { cursor, ...rest } = res.data
          const colors = {}
          const otherFields = {}
          cursor && dispatch(setCursor(cursor))
          Object.keys(rest).forEach((k) => {
            if (k.startsWith('color')) colors[k] = rest[k]
            else if (k.includes('item') || k.includes('target'))
              dispatch(setIconTheme({ field: k, url: rest[k] }))
            else otherFields[k] = rest[k]
          })
          Object.keys(colors).length && dispatch(setColorTheme(colors))
          dispatch(setTheme(otherFields))
        }
      }
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
    <Space
      direction="vertical"
      size="large"
      align="center"
      className={`w-100 ${level < 4 ? styles.locked : ''}`}>
      {contextHolder}
      <Row justify="start" className="mb-3">
        <Typography.Title level={5}>Choose user defined theme</Typography.Title>
      </Row>
      <Table columns={columns} dataSource={publishedThemes} />
    </Space>
  )
}

export default SelectPresetThemeForm
