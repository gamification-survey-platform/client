import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Space, Table, Typography } from 'antd'
import useMessage from 'antd/es/message/useMessage'
import { getPurchases } from '../../api/rewards'
import dayjs from 'dayjs'

const Purchases = () => {
  const [messageApi, contextHolder] = useMessage()
  const [purchases, setPurchases] = useState([])

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await getPurchases()
        if (res.status === 200) setPurchases(res.data)
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: `Failed to retrieve purchases. ${error.message}`
        })
      }
    }
    fetchPurchases()
  }, [])

  const columns = [
    { title: 'Reward', dataIndex: 'name', align: 'center', key: 'reward' },
    { title: 'Course', dataIndex: 'belong_to', align: 'center', key: 'course' },
    {
      title: 'Date Purchased',
      dataIndex: 'date_purchased',
      key: 'date_purchased',
      render: (d) => {
        const dayObject = dayjs(d.date_purchased)
        return dayObject.format('MM/DD/YYYY')
      }
    },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ]

  const pendingPurchases = purchases.filter((purchase) => !purchase.fulfilled)
  const fulfilledPurchases = purchases.filter((purchase) => purchase.fulfilled)
  return (
    <div className="m-5">
      {contextHolder}
      <Space direction="vertical" className="w-100">
        <Typography.Title level={3}>Unused Purchases</Typography.Title>
        <Table className="text-center" columns={columns} dataSource={pendingPurchases} />
        <Typography.Title level={3}>Fulfilled Purchases</Typography.Title>
        <Table titlclassName="text-center" columns={columns} dataSource={fulfilledPurchases} />
      </Space>
    </div>
  )
}

export default Purchases
