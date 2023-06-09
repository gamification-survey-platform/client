import {
  Typography,
  Form,
  ColorPicker,
  Row,
  Button,
  theme,
  Space,
  Divider,
  Upload,
  Image as AntdImage,
  Input
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import { useToken } from 'antd/es/theme/internal'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setColorTheme } from '../../store/theme/themeSlice'
import { editTheme } from '../../api/theme'
import useMessage from 'antd/es/message/useMessage'
import userSelector from '../../store/user/selectors'

const CustomizeColorForm = () => {
  const { level } = useSelector(userSelector)
  const form = useForm()
  const [messageApi, contextHolder] = useMessage()
  const { defaultAlgorithm, defaultSeed } = theme
  const mapToken = defaultAlgorithm(defaultSeed)
  const dispatch = useDispatch()

  const handleColorChange = async (name, value) => {
    try {
      if (level < 1) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 1!'
        })
        return
      }
      const res = await editTheme({ [name]: value })
      if (res.status === 200) dispatch(setColorTheme({ [name]: value }))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handleResetColorTheme = async () => {
    try {
      const res = await editTheme(mapToken)
      if (res.status === 200) dispatch(setColorTheme(res.data))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }
  return (
    <Space direction="vertical" size="large" align="center" className="w-100">
      {contextHolder}
      <Row justify="start" className="mb-3">
        <Typography.Title level={5}>Theme Customization</Typography.Title>
      </Row>
      <Space direction="horizontal" size="large">
        <Form.Item name="colorBgBase" label="Background Base Color">
          <ColorPicker onChange={(_, value) => handleColorChange('colorBgBase', value)} />
        </Form.Item>
        <Form.Item name="colorTextBase" label="Text Color">
          <ColorPicker onChange={(_, value) => handleColorChange('colorTextBase', value)} />
        </Form.Item>
        <Form.Item name="colorPrimary" label="Primary Color">
          <ColorPicker onChange={(_, value) => handleColorChange('colorPrimary', value)} />
        </Form.Item>
        <Form.Item name="colorSuccess" label="Success Color">
          <ColorPicker onChange={(_, value) => handleColorChange('colorSuccess', value)} />
        </Form.Item>
        <Form.Item name="colorWarning" label="Warning Color">
          <ColorPicker onChange={(_, value) => handleColorChange('colorWarning', value)} />
        </Form.Item>
        <Form.Item name="colorError" label="Error Color">
          <ColorPicker onChange={(_, value) => handleColorChange('colorError', value)} />
        </Form.Item>
      </Space>
      <Form.Item>
        <Button onClick={handleResetColorTheme}>Reset Color Theme</Button>
      </Form.Item>
    </Space>
  )
}

export default CustomizeColorForm
