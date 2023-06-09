import { Typography, Form, Input, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import userSelector from '../../store/user/selectors'
import useMessage from 'antd/es/message/useMessage'
import { setTheme } from '../../store/theme/themeSlice'
import { editTheme } from '../../api/theme'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'

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

  return (
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
      {contextHolder}
      <Typography.Title level={5}>Level 5</Typography.Title>
      <Form.Item
        label="Theme name"
        name="name"
        rules={[{ required: true, message: 'Your theme needs a name!' }]}>
        <Input />
      </Form.Item>
      <Button disabled={level < 5} onClick={handleThemePublishChange}>
        {is_published ? 'Hide' : 'Publish'} Your Theme
      </Button>
    </div>
  )
}

export default PublishThemeForm
