import { Typography, Form, ColorPicker, Row, Button, Col, Space, Image } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import { useToken } from 'antd/es/theme/internal'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setColorTheme, setCursor } from '../../store/theme/themeSlice'
import { editTheme } from '../../api/theme'
import { hot, cool, earth } from './presetThemes'
import Flower from '../../assets/cursors/flower.png'
import Lightsaber from '../../assets/cursors/lightsaber.png'
import Wand from '../../assets/cursors/wand.png'
import Pokeball from '../../assets/cursors/pokeball.png'
import Mario from '../../assets/cursors/mario.png'
import useMessage from 'antd/es/message/useMessage'
import userSelector from '../../store/user/selectors'

const Theme = () => {
  const [form] = useForm()
  const { color, cursor } = useSelector(themeSelector)
  const { level } = useSelector(userSelector)
  const [messageApi, contextHolder] = useMessage()
  const [_, token] = useToken()
  const dispatch = useDispatch()

  useEffect(() => {
    if (color && Object.keys(color).length) {
      form.setFieldsValue(color)
    } else {
      form.setFieldsValue(token)
    }
  }, [color])

  const handleThemeChange = async (name, value) => {
    try {
      if (level < 3) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 3!'
        })
        return
      }
      const res = await editTheme({ [name]: value })
      if (res.status === 200) dispatch(setColorTheme({ [name]: value }))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handlePresetThemeChange = async (values) => {
    try {
      if (level < 1) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 1!'
        })
        return
      }
      const res = await editTheme(values)
      if (res.status === 200) dispatch(setColorTheme(values))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handleCursorChange = async (cursor) => {
    try {
      if (level < 2) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 2!'
        })
        return
      }
      const res = await editTheme({ cursor })
      if (res.status === 200) dispatch(setCursor(cursor))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handleResetCursor = async () => {
    try {
      const res = await editTheme({ cursor: '' })
      if (res.status === 200) dispatch(setCursor(null))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handleResetColorTheme = async () => {
    try {
      const overridenThemes = {}
      Object.keys(color).forEach((key) => (overridenThemes[key] = ''))
      const res = await editTheme(overridenThemes)
      if (res.status === 200) dispatch(setColorTheme(overridenThemes))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  return (
    <Form form={form} className="my-3 ml-3">
      {contextHolder}
      <Row>
        <Col span={6} className="border-right pr-3">
          <Space direction="vertical" className="ml-3 align-items-center">
            <Typography.Title level={3} className="text-center">
              Choose a preset theme
            </Typography.Title>
            <Button onClick={() => handlePresetThemeChange(hot)}>Fire</Button>
            <Button onClick={() => handlePresetThemeChange(cool)}>Water</Button>
            <Button onClick={() => handlePresetThemeChange(earth)}>Earth</Button>
            <Button className="mt-3" onClick={handleResetColorTheme}>
              Reset Color Theme
            </Button>
          </Space>
        </Col>
        <Col span={6} className="border-right px-3">
          <Space direction="vertical" className="ml-3 align-items-center">
            <Typography.Title level={3} className="text-center">
              Choose a cursor
            </Typography.Title>
            <img src={Flower} role="button" onClick={() => handleCursorChange('flower')} />
            <img src={Lightsaber} role="button" onClick={() => handleCursorChange('lightsaber')} />
            <img src={Mario} role="button" onClick={() => handleCursorChange('mario')} />
            <img src={Pokeball} role="button" onClick={() => handleCursorChange('pokeball')} />
            <img src={Wand} role="button" onClick={() => handleCursorChange('wand')} />
            <Button className="mt-3" onClick={handleResetCursor}>
              Reset to default
            </Button>
          </Space>
        </Col>
        <Col span={6} className="text-center">
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
            <Form.Item>
              <Button onClick={handleResetColorTheme}>Reset Color Theme</Button>
            </Form.Item>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default Theme
