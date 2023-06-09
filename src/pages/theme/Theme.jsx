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
  Image as AntdImage
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import { useToken } from 'antd/es/theme/internal'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  setColorTheme,
  setCursor,
  setIconTheme,
  resetIconTheme
} from '../../store/theme/themeSlice'
import { editTheme, editThemeIcon } from '../../api/theme'
import useMessage from 'antd/es/message/useMessage'
import userSelector from '../../store/user/selectors'
import { dataURLtoFile } from './utils'

const Theme = () => {
  const [form] = useForm()
  const {
    color,
    cursor,
    multiple_choice_item,
    multiple_choice_target,
    multiple_select_item,
    multiple_select_target,
    scale_multiple_choice_item,
    scale_multiple_choice_target
  } = useSelector(themeSelector)
  const { level } = useSelector(userSelector)
  const [messageApi, contextHolder] = useMessage()
  const [_, token] = useToken()
  const dispatch = useDispatch()
  const { defaultAlgorithm, defaultSeed } = theme
  const mapToken = defaultAlgorithm(defaultSeed)
  const iconData = [
    { name: 'Multiple Choice', item: multiple_choice_item, target: multiple_choice_target },
    { name: 'Multiple Select', item: multiple_select_item, target: multiple_select_target },
    {
      name: 'Scale Multiple Choice',
      item: scale_multiple_choice_item,
      target: scale_multiple_choice_target
    }
  ]

  useEffect(() => {
    if (color && Object.keys(color).length) {
      form.setFieldsValue(color)
    } else {
      form.setFieldsValue(token)
    }
  }, [color])

  const handleColorChange = async (name, value) => {
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

  const handleResetColorTheme = async () => {
    try {
      const res = await editTheme(mapToken)
      if (res.status === 200) dispatch(setColorTheme(res.data))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handleCursorChange = async (file) => {
    try {
      if (level < 2) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 2!'
        })
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = 28
          canvas.height = 28
          ctx.drawImage(img, 0, 0, 28, 28)
          const data = canvas.toDataURL('image/png')
          const file = dataURLtoFile(data)
          const res = await editThemeIcon({ cursor: file })
          if (res.status === 200) {
            const { upload_url = null, download_url = null, delete_url = null, ...rest } = res.data
            dispatch(setCursor(download_url))
          }
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
    return false
  }

  const handleResetCursor = async () => {
    try {
      const res = await editThemeIcon({ cursor: '' })
      if (res.status === 200) {
        form.setFieldValue('cursor', null)
        dispatch(setCursor(null))
      }
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handleChangeSurveyIcon = async (field, file) => {
    try {
      const res = await editThemeIcon({ [field]: file })
      if (res.status === 200) {
        const { upload_url = null, download_url = null, delete_url = null, ...rest } = res.data
        dispatch(setIconTheme({ field, url: download_url }))
      }
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handleResetSurveyIcons = async () => {
    try {
      const fields = [
        'multiple_choice_item',
        'multiple_choice_target',
        'scale_multiple_choice_item',
        'scale_multiple_choice_target',
        'multiple_select_item',
        'multiple_select_target'
      ]
      fields.forEach(async (field) => {
        const res = await editThemeIcon({ [field]: '' })
        if (res.status === 200) {
          const { upload_url = null, download_url = null, delete_url = null, ...rest } = res.data
        }
      })
      dispatch(resetIconTheme())
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  return (
    <>
      <Form form={form} className="my-3 ml-3">
        {contextHolder}
        <div
          className="text-center"
          style={{
            backgroundColor: '#F5F5F5',
            border: '1px solid #d9d9d9',
            borderRadius: '5%',
            position: 'fixed',
            padding: '1rem',
            top: 75,
            right: 10,
            zIndex: 1,
            width: 250
          }}>
          <Typography.Title level={5}>Level 5</Typography.Title>
          <Button disabled={level < 5}>Publish Your Theme</Button>
        </div>
        <Row justify="start">
          <Typography.Title level={2}>Level 0</Typography.Title>
        </Row>
        <Space direction="vertical" size="large" align="center" className="w-100">
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
          <Form.Item name="cursor" getValueFromEvent={(e) => e.fileList[0]}>
            <Upload
              maxCount={1}
              showUploadList={false}
              accept="image/png, image/jpeg, image/jpg"
              beforeUpload={handleCursorChange}>
              <Button>Upload Cursor Icon</Button>
            </Upload>
          </Form.Item>
          {cursor ? <AntdImage src={cursor} /> : null}
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
            <Typography.Title level={5}>Choose Survey Theme Icons</Typography.Title>
          </Row>
          <Space direction="vertical" className="text-center" size="large">
            {iconData.map((iconData, i) => {
              const { item, target, name } = iconData
              const formName = name.split(' ').join('_').toLowerCase()
              return (
                <Space key={i} direction="horizontal">
                  <Space direction="vertical">
                    <Form.Item name={`${formName}_item`}>
                      <Upload
                        showUploadList={false}
                        maxCount={1}
                        accept="image/png, image/jpeg, image/jpg"
                        beforeUpload={async (file) => {
                          await handleChangeSurveyIcon(`${formName}_item`, file)
                          return false
                        }}>
                        <Button>Upload {name} Question Item</Button>
                      </Upload>
                    </Form.Item>
                    <AntdImage src={item} height={50} />
                  </Space>
                  <Space direction="vertical">
                    <Form.Item name={`${formName}_target`}>
                      <Upload
                        maxCount={1}
                        showUploadList={false}
                        accept="image/png, image/jpeg, image/jpg"
                        beforeUpload={async (file) => {
                          await handleChangeSurveyIcon(`${formName}_target`, file)
                          return false
                        }}>
                        <Button>Upload {name} Question Target</Button>
                      </Upload>
                    </Form.Item>
                    <AntdImage src={target} height={50} />
                  </Space>
                </Space>
              )
            })}
            <Button className="mt-3" onClick={handleResetSurveyIcons}>
              Reset to default
            </Button>
          </Space>
        </Space>
      </Form>
    </>
  )
}

export default Theme
