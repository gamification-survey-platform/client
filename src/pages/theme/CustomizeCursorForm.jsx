import { Typography, Form, Row, Button, Space, Upload, Image as AntdImage } from 'antd'
import { useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import { useDispatch } from 'react-redux'
import { setCursor } from '../../store/theme/themeSlice'
import { editThemeIcon } from '../../api/theme'
import useMessage from 'antd/es/message/useMessage'
import userSelector from '../../store/user/selectors'
import { dataURLtoFile } from '../../utils/imageUtils'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import styles from '../../styles/Theme.module.css'

const CustomizeCursorForm = () => {
  const form = useFormInstance()
  const { cursor } = useSelector(themeSelector)
  const { level } = useSelector(userSelector)
  const [messageApi, contextHolder] = useMessage()
  const dispatch = useDispatch()

  const handleCursorChange = async (file) => {
    try {
      if (level < 3) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 3!'
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

  return (
    <Space
      direction="vertical"
      size="large"
      align="center"
      className={`w-100 ${level < 3 ? styles.locked : ''}`}>
      {contextHolder}
      <Row justify="start" className="mb-3">
        <Typography.Title level={5}>Choose Cursor</Typography.Title>
      </Row>
      <Form.Item name="cursor" getValueFromEvent={(e) => e.fileList[0]}>
        <Upload
          maxCount={1}
          showUploadList={false}
          accept="image/png, image/jpeg, image/jpg"
          beforeUpload={handleCursorChange}>
          <Button disabled={level < 3}>Upload Cursor Icon</Button>
        </Upload>
      </Form.Item>
      {cursor ? <AntdImage src={cursor} /> : null}
      <Button disabled={level < 3} className="mt-3" onClick={handleResetCursor}>
        Reset to default
      </Button>
    </Space>
  )
}

export default CustomizeCursorForm
