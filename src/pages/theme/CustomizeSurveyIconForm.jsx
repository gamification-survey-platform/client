import { Typography, Form, Row, Button, Space, Upload, Image as AntdImage } from 'antd'
import { useSelector } from 'react-redux'
import themeSelector from '../../store/theme/selectors'
import { useDispatch } from 'react-redux'
import { setIconTheme, resetIconTheme } from '../../store/theme/themeSlice'
import { editThemeIcon } from '../../api/theme'
import useMessage from 'antd/es/message/useMessage'
import userSelector from '../../store/user/selectors'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'

const CustomizeSurveyIconForm = () => {
  const form = useFormInstance()
  const {
    multiple_choice_item,
    multiple_choice_target,
    multiple_select_item,
    multiple_select_target,
    scale_multiple_choice_item,
    scale_multiple_choice_target
  } = useSelector(themeSelector)
  const { level } = useSelector(userSelector)
  const [messageApi, contextHolder] = useMessage()
  const dispatch = useDispatch()
  const iconData = [
    { name: 'Multiple Choice', item: multiple_choice_item, target: multiple_choice_target },
    { name: 'Multiple Select', item: multiple_select_item, target: multiple_select_target },
    {
      name: 'Scale Multiple Choice',
      item: scale_multiple_choice_item,
      target: scale_multiple_choice_target
    }
  ]

  const handleChangeSurveyIcon = async (field, file) => {
    try {
      if (level < 4) {
        messageApi.open({
          type: 'error',
          content: 'This feature is only available for users above level 4!'
        })
        return
      }
      const res = await editThemeIcon({ [field]: file })
      if (res.status === 200) {
        form.setFieldValue(field, null)
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
    <Space direction="vertical" size="large" align="center" className="w-100">
      {contextHolder}
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
  )
}

export default CustomizeSurveyIconForm
