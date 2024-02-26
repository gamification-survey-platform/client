import { useState, useEffect } from 'react'
import { Space, Divider, Typography, Row, Button, Table, Switch } from 'antd'
import { useSelector } from 'react-redux'
import coursesSelector from '../../store/courses/selectors'
import userSelector from '../../store/user/selectors'
import { useParams } from 'react-router'
import { getCourseRewards, getCoursePurchases, patchCoursePurchases } from '../../api/rewards'
import Reward from '../../components/Reward'
import RewardsModal from './RewardsModal'
import useMessage from 'antd/es/message/useMessage'
import dayjs from 'dayjs'

const CourseRewards = () => {
  const courses = useSelector(coursesSelector)
  const [rewards, setRewards] = useState([])
  const [purchases, setPurchases] = useState([])
  const [messageApi, contextHolder] = useMessage()
  const { course_id } = useParams()
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false)
  const course = courses.find(({ course_number }) => course_number === course_id)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getCourseRewards({ course_id: course.pk })
        if (res.status === 200) setRewards(res.data)
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: `Failed to fetch course rewards. ${error.message}`
        })
      }
      try {
        const res = await getCoursePurchases({ course_id: course.pk })
        if (res.status === 200)
          setPurchases(res.data.map((purchase, i) => ({ ...purchase, key: i })))
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: `Failed to fetch course purchases. ${error.message}`
        })
      }
    }
    loadData()
  }, [rewardsModalOpen])

  const handleSwitch = async (fulfilled, purchase) => {
    try {
      const newPurchase = { ...purchase, fulfilled }
      const res = await patchCoursePurchases({ course_id: course.pk, purchase: newPurchase })
      if (res.status === 204) {
        const newPurchases = purchases.map((p) => (p.pk === purchase.pk ? newPurchase : p))
        setPurchases(newPurchases)
      }
    } catch (error) {
      messageApi.open({ type: 'error', message: `Failed to update purchase. ${error.message}.` })
    }
  }
  const columns = [
    { title: 'Reward', dataIndex: 'name', align: 'center', key: 'reward' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Buyer', dataIndex: 'buyer', key: 'buyer' },
    {
      title: 'Date Purchased',
      dataIndex: 'date_purchased',
      key: 'date_purchased',
      render: (d) => {
        const dayObject = dayjs(d.date_purchased)
        return dayObject.format('MM/DD/YYYY')
      }
    },
    {
      title: 'Fulfilled',
      dataIndex: 'fulfilled',
      key: 'fulfilled',
      render: (_, purchase) => {
        return (
          <Switch
            key={purchase.pk}
            checked={purchase.fulfilled}
            onChange={(fulfilled) => handleSwitch(fulfilled, purchase)}
          />
        )
      }
    }
  ]

  return (
    <div className="m-5">
      {contextHolder}
      <Typography.Title level={2}>Current Rewards</Typography.Title>
      <Row gutter={16} style={{ margin: '1rem' }}>
        {rewards.map((r, i) => (
          <Reward {...r} key={i} rewards={rewards} setRewards={setRewards} />
        ))}
      </Row>
      <div className="text-center">
        <Button type="primary" onClick={() => setRewardsModalOpen(true)}>
          Add Reward
        </Button>
      </div>
      <RewardsModal
        open={rewardsModalOpen}
        setOpen={setRewardsModalOpen}
        rewards={rewards}
        setRewards={setRewards}
      />
      <Divider />
      <Typography.Title level={2}>Student Purchases</Typography.Title>
      <Space direction="vertical" className="w-100">
        <Table className="text-center" columns={columns} dataSource={purchases} />
      </Space>
    </div>
  )
}

export default CourseRewards
