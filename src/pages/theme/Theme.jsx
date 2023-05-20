import { Typography, Form, ColorPicker, Row, Button, Col, Space } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import { useToken } from 'antd/es/theme/internal'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setTheme, resetTheme } from '../../store/theme/themeSlice'
import { editTheme } from '../../api/theme'
import { hot, cool, earth } from './presetThemes'
import useMessage from 'antd/es/message/useMessage'

const Theme = () => {
  const [form] = useForm()
  const theme = useSelector(themeSelector)
  const [messageApi, contextHolder] = useMessage()
  const [_, token] = useToken()
  const dispatch = useDispatch()

  useEffect(() => {
    if (theme && Object.keys(theme).length) {
      form.setFieldsValue(theme)
    } else {
      form.setFieldsValue(token)
    }
  }, [theme])

  const handleThemeChange = async (name, value) => {
    try {
      const res = await editTheme({ [name]: value })
      if (res.status === 200) dispatch(setTheme({ [name]: value }))
    } catch (e) {
      messageApi({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handlePresetThemeChange = async (values) => {
    try {
      const res = await editTheme(values)
      if (res.status === 200) dispatch(setTheme(values))
    } catch (e) {
      messageApi({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  return (
    <Form form={form} className="my-3">
      {contextHolder}
      <Row>
        <Col span={12} className="text-center">
          <Row justify="center" className="mb-3">
            <Typography.Title level={3}>Customize your theme</Typography.Title>
          </Row>
          <Space direction="vertical" className="align-items-center">
            <Form.Item name="colorBgBase" label="Background Base Color">
              <ColorPicker onChange={(_, value) => handleThemeChange('colorBgBase', value)} />
            </Form.Item>
            <Form.Item name="colorTextBase" label="Text Color">
              <ColorPicker onChange={(_, value) => handleThemeChange('colorTextBase', value)} />
            </Form.Item>
            <Form.Item name="colorPrimary" label="Primary Color">
              <ColorPicker onChange={(_, value) => handleThemeChange('colorPrimary', value)} />
            </Form.Item>
            <Form.Item name="colorSuccess" label="Success Color">
              <ColorPicker onChange={(_, value) => handleThemeChange('colorSuccess', value)} />
            </Form.Item>
            <Form.Item name="colorWarning" label="Warning Color">
              <ColorPicker onChange={(_, value) => handleThemeChange('colorWarning', value)} />
            </Form.Item>
            <Form.Item name="colorError" label="Error Color">
              <ColorPicker onChange={(_, value) => handleThemeChange('colorError', value)} />
            </Form.Item>
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical" className="ml-3 align-items-center">
            <Typography.Title level={3} className="text-center">
              Choose a preset theme
            </Typography.Title>
            <Button onClick={() => handlePresetThemeChange(hot)}>Fire</Button>
            <Button onClick={() => handlePresetThemeChange(cool)}>Water</Button>
            <Button onClick={() => handlePresetThemeChange(earth)}>Earth</Button>
          </Space>
        </Col>
      </Row>
      <Row justify="center" className="my-3">
        <Form.Item>
          <Button onClick={() => dispatch(resetTheme())}>Reset Theme</Button>
        </Form.Item>
      </Row>
    </Form>
  )
}

export default Theme
