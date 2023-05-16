import { Typography, Form, ColorPicker, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import themeSelector from '../store/theme/selectors'
import { useToken } from 'antd/es/theme/internal'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setTheme } from '../store/theme/themeSlice'

const Theme = () => {
  const [form] = useForm()
  const theme = useSelector(themeSelector)
  const [_, token] = useToken()
  const dispatch = useDispatch()

  useEffect(() => {
    if (theme) {
      form.setFieldsValue(theme)
    } else {
      form.setFieldsValue(token)
    }
  }, [])

  const handleThemeChange = (name, value) => {
    dispatch(setTheme({ [name]: value }))
  }

  return (
    <Form form={form} onChange={console.log} className="m-3">
      <Row justify="center" className="mb-3">
        <Typography.Title level={3}>Customize your theme</Typography.Title>
      </Row>
      <Row justify="space-around">
        <Form.Item name="colorBgBase" label="Background Base Color">
          <ColorPicker onChange={(_, value) => handleThemeChange('colorBgBase', value)} />
        </Form.Item>
        <Form.Item name="colorTextBase" label="Text Color">
          <ColorPicker onChange={(_, value) => handleThemeChange('colorTextBase', value)} />
        </Form.Item>
      </Row>
      <Row justify="space-around">
        <Form.Item name="colorPrimary" label="Primary Color">
          <ColorPicker onChange={(_, value) => handleThemeChange('colorPrimary', value)} />
        </Form.Item>
        <Form.Item name="colorSuccess" label="Success Color">
          <ColorPicker onChange={(_, value) => handleThemeChange('colorSuccess', value)} />
        </Form.Item>
      </Row>
      <Row justify="space-around">
        <Form.Item name="colorWarning" label="Warning Color">
          <ColorPicker onChange={(_, value) => handleThemeChange('colorWarning', value)} />
        </Form.Item>
        <Form.Item name="colorError" label="Error Color">
          <ColorPicker onChange={(_, value) => handleThemeChange('colorError', value)} />
        </Form.Item>
      </Row>
    </Form>
  )
}

export default Theme
