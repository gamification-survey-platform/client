import { Row, Form, Typography, Space, ColorPicker, Upload, Button, theme } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { createTheme } from '../../api/theme'
import { useState } from 'react'
import { dataURLtoFile } from './utils.js'

const CustomThemeForm = () => {
  const [form] = useForm()
  const { defaultAlgorithm, defaultSeed } = theme
  const mapToken = defaultAlgorithm(defaultSeed)
  const [fileObjects, setFileObjects] = useState({})

  const handleCursorChange = async (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 28
        canvas.height = 28
        ctx.drawImage(img, 0, 0, 28, 28)
        const data = canvas.toDataURL('image/png')
        const file = dataURLtoFile(data)
        setFileObjects({ ...fileObjects, cursor: file })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
    return false
  }

  const handleCreateTheme = async () => {
    try {
      await form.validateFields()
      const formData = new FormData()
      const fields = form.getFieldsValue()
      Object.keys(fields).forEach(async (k) => {
        let formattedValue = fields[k]
        if (k.includes('icon') && fileObjects[k]) {
          formData.set(k, fileObjects[k])
        } else if (k === 'cursor' && fileObjects[k]) {
          formData.set(k, fileObjects[k])
        } else {
          formData.set(k, formattedValue)
        }
      })
      console.log('here')
      const res = await createTheme(formData)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="m-3">
      <Row justify="center">
        <Typography.Title level={2}>Create Personal Theme</Typography.Title>
      </Row>
      <Form form={form} initialValues={mapToken}>
        <Row>
          <Typography.Title level={4}>Theme Colors</Typography.Title>
        </Row>
        <Space direction="horizontal" size="large">
          <Form.Item name="colorBgBase" label="Background Base Color">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="colorTextBase" label="Text Color">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="colorPrimary" label="Primary Color">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="colorSuccess" label="Success Color">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="colorWarning" label="Warning Color">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="colorError" label="Error Color">
            <ColorPicker />
          </Form.Item>
        </Space>
        <Row>
          <Typography.Title level={4}>Cursor Icon</Typography.Title>
        </Row>
        <Form.Item
          name="cursor"
          getValueFromEvent={(e) => e.fileList[0]}
          rules={[{ required: true, message: 'Please upload a custom cursor.' }]}>
          <Upload
            maxCount={1}
            accept="image/png, image/jpeg, image/jpg"
            beforeUpload={handleCursorChange}>
            <Button>Upload Cursor Icon (must be 28x28px in JPG or PNG format)</Button>
          </Upload>
        </Form.Item>
        <Row className="my-3">
          <Typography.Title level={4}>Survey Icons</Typography.Title>
        </Row>
        <Space direction="vertical">
          <Form.Item
            name="multiple_choice_icon"
            getValueFromEvent={(e) => e.fileList[0]}
            rules={[{ required: true, message: 'Please upload a custom icon.' }]}>
            <Upload
              maxCount={1}
              accept="image/png, image/jpeg, image/jpg"
              beforeUpload={(file) => {
                setFileObjects({ ...fileObjects, multiple_choice_icon: file })
                return false
              }}>
              <Button>Upload Multiple Choice Question Icon</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="scale_multiple_choice_icon"
            getValueFromEvent={(e) => e.fileList[0]}
            rules={[{ required: true, message: 'Please upload a custom icon.' }]}>
            <Upload
              maxCount={1}
              accept="image/png, image/jpeg, image/jpg"
              beforeUpload={(file) => {
                setFileObjects({ ...fileObjects, scale_multiple_choice_icon: file })
                return false
              }}>
              <Button>Upload Scale Question Icon</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="multiple_select_icon"
            getValueFromEvent={(e) => e.fileList[0]}
            rules={[{ required: true, message: 'Please upload a custom icon.' }]}>
            <Upload
              maxCount={1}
              accept="image/png, image/jpeg, image/jpg"
              beforeUpload={(file) => {
                setFileObjects({ ...fileObjects, multiple_select_icon: file })
                return false
              }}>
              <Button>Upload Multiple Select Icon</Button>
            </Upload>
          </Form.Item>
        </Space>
        <Row justify="center">
          <Button onClick={handleCreateTheme}>Create Theme</Button>
        </Row>
      </Form>
    </div>
  )
}

export default CustomThemeForm
