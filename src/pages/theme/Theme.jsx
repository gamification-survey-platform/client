import { Typography, Form, ColorPicker, Row, Button, Col, Space, Divider, SeedToken } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import { useToken } from 'antd/es/theme/internal'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setColorTheme, setCursor, setMultipleChoice } from '../../store/theme/themeSlice'
import { editTheme } from '../../api/theme'
import Flower from '../../assets/cursors/flower.png'
import Lightsaber from '../../assets/cursors/lightsaber.png'
import Wand from '../../assets/cursors/wand.png'
import Pokeball from '../../assets/cursors/pokeball.png'
import Mario from '../../assets/cursors/mario.png'
import Dog from '../../assets/multiple-choice/nature/dog.jpeg'
import Car from '../../assets/multiple-choice/transportation/car.avif'
import Basketball from '../../assets/multiple-choice/sports/basketball.jpg'
import Pie from '../../assets/multiple-choice/food/pie.png'
import useMessage from 'antd/es/message/useMessage'
import userSelector from '../../store/user/selectors'
import CustomThemeForm from './CustomThemeForm'

const Theme = () => {
  const [form] = useForm()
  const { color } = useSelector(themeSelector)
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

  const handleMultipleChoiceThemeChange = async (value) => {
    try {
      const res = await editTheme({ multiple_choice: value })
      if (res.status === 200) dispatch(setMultipleChoice(value))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

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
    <>
      <Form form={form} className="my-3 ml-3">
        {contextHolder}
        <Row justify="start">
          <Typography.Title level={2}>Level 0</Typography.Title>
        </Row>
        <Space direction="vertical" size="large" align="center" className="w-100">
          <Row justify="start" className="mb-3">
            <Typography.Title level={5}>Theme Customization</Typography.Title>
          </Row>
          <Space direction="horizontal" size="large">
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
          <Form.Item>
            <Button onClick={handleResetColorTheme}>Reset Color Theme</Button>
          </Form.Item>
        </Space>
        <Divider />
        <Row justify="start">
          <Typography.Title level={2}>Level 1</Typography.Title>
        </Row>
        <Space direction="vertical" size="large" align="center" className="w-100">
          <Row justify="start" className="mb-3">
            <Typography.Title level={5}>Choose user defined theme</Typography.Title>
          </Row>
        </Space>
        <Divider />
        <Row justify="start">
          <Typography.Title level={2}>Level 2</Typography.Title>
        </Row>
        <Space direction="vertical" size="large" align="center" className="w-100">
          <Row justify="start" className="mb-3">
            <Typography.Title level={5}>Choose Cursor</Typography.Title>
          </Row>
          <Space direction="horizontal" size="large" align="center" className="w-100">
            <img src={Flower} role="button" onClick={() => handleCursorChange('flower')} />
            <img src={Lightsaber} role="button" onClick={() => handleCursorChange('lightsaber')} />
            <img src={Mario} role="button" onClick={() => handleCursorChange('mario')} />
            <img src={Pokeball} role="button" onClick={() => handleCursorChange('pokeball')} />
            <img src={Wand} role="button" onClick={() => handleCursorChange('wand')} />
          </Space>
          <Button className="mt-3" onClick={handleResetCursor}>
            Reset to default
          </Button>
        </Space>
        <Divider />
        <Row justify="start">
          <Typography.Title level={2}>Level 3</Typography.Title>
        </Row>
        <Space direction="vertical" size="large" align="center" className="w-100">
          <Row justify="start" className="mb-3">
            <Typography.Title level={5}>Choose Survey Theme</Typography.Title>
          </Row>
          <Space direction="horizontal" size="large">
            <Button
              size="large"
              style={{ minHeight: 60 }}
              icon={<img src={Dog} style={{ width: 50, height: 50 }} />}
              onClick={() => handleMultipleChoiceThemeChange('nature')}>
              Nature
            </Button>
            <Button
              size="large"
              style={{ minHeight: 60 }}
              icon={<img src={Basketball} style={{ width: 50, height: 50 }} />}
              onClick={() => handleMultipleChoiceThemeChange('sports')}>
              Sports
            </Button>
            <Button
              size="large"
              style={{ minHeight: 60 }}
              icon={<img src={Pie} style={{ width: 50, height: 50 }} />}
              onClick={() => handleMultipleChoiceThemeChange('food')}>
              Food
            </Button>
            <Button
              size="large"
              style={{ minHeight: 60 }}
              icon={<img src={Car} style={{ width: 50, height: 50 }} />}
              onClick={() => handleMultipleChoiceThemeChange('transportation')}>
              Transportation
            </Button>
          </Space>
        </Space>
      </Form>
      <Divider />
      <CustomThemeForm />
    </>
  )
}

export default Theme
