import { Typography, Form, Row, Divider } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import { useToken } from 'antd/es/theme/internal'
import { useEffect } from 'react'
import PublishThemeForm from './PublishThemeForm'
import CustomizeColorForm from './CustomizeColorForm'
import SelectPresetThemeForm from './SelectPresetThemeForm'
import CustomizeCursorForm from './CustomizeCursorForm'
import CustomizeSurveyIconForm from './CustomizeSurveyIconForm'

const Theme = () => {
  const [form] = useForm()
  const { name, color } = useSelector(themeSelector)
  const [_, token] = useToken()
  const level = 0
  useEffect(() => {
    if (color && Object.keys(color).length) {
      form.setFieldsValue(color)
    } else {
      form.setFieldsValue(token)
    }

    if (name) form.setFieldsValue({ name })
  }, [color, name])
  return (
    <>
      <Form form={form} className="my-3 ml-3">
        <Row justify="start">
          <Typography.Title level={2}>Level 1</Typography.Title>
        </Row>
        <CustomizeColorForm />
        <Divider />
        <Row justify="start">
          <Typography.Title level={2}>Level 2</Typography.Title>
        </Row>
        <SelectPresetThemeForm />
        <Divider />
        <Row justify="start">
          <Typography.Title level={2}>Level 3</Typography.Title>
        </Row>
        <CustomizeCursorForm />
        <Divider />
        <Row justify="start">
          <Typography.Title level={2}>Level 4</Typography.Title>
        </Row>
        <CustomizeSurveyIconForm />
        <Divider />
        <Row justify="start">
          <Typography.Title level={2}>Level 5</Typography.Title>
        </Row>
        <PublishThemeForm />
      </Form>
    </>
  )
}

export default Theme
