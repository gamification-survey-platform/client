import { Typography, Form, Input, Button, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import userSelector from '../../store/user/selectors'
import useMessage from 'antd/es/message/useMessage'
import { setTheme } from '../../store/theme/themeSlice'
import { editTheme } from '../../api/theme'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import styles from '../../styles/Theme.module.css'

const PublishThemeForm = () => {
  const { is_published } = useSelector(themeSelector)
  const { level } = useSelector(userSelector)
  const form = useFormInstance()
  const [messageApi, contextHolder] = useMessage()
  const dispatch = useDispatch()

  const handleThemePublishChange = async () => {
    try {
      if (level < 5) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 5!'
        })
        return
      }
      form.validateFields()
      const currentlyPublished = is_published
      const { name } = form.getFieldsValue()
      let res
      res = await editTheme({ is_published: !currentlyPublished })
      res = await editTheme({ name })
      if (res.status === 200) dispatch(setTheme({ is_published: !currentlyPublished, name }))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  const handleThemeNameChange = async () => {
    try {
      if (level < 5) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 5!'
        })
        return
      }
      form.validateFields()
      const { name } = form.getFieldsValue()
      const res = await editTheme({ name })
      if (res.status === 200) dispatch(setTheme({ name }))
    } catch (e) {
      messageApi.open({ type: 'error', content: `Failed to set theme. ${e.message}` })
    }
  }

  return (
    <div
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
      }}
      className="text-center">
      {contextHolder}
      <Typography.Title level={5}>Level 5</Typography.Title>
      <div className={level < 4 ? styles.locked : ''}>
        <Form.Item
          label="Theme name"
          name="name"
          rules={[{ required: true, message: 'Your theme needs a name!' }]}>
          <Input />
        </Form.Item>
        <Space direction="vertical">
          <Button onClick={handleThemeNameChange}>Change Theme Name</Button>
          <Button disabled={level < 5} onClick={handleThemePublishChange}>
            {is_published ? 'Hide' : 'Publish'} Your Theme
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default PublishThemeForm