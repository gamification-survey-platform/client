import { useEffect, useState } from 'react'
import { getCourseLeaderboard, getPlatformLeaderboard } from '../api/leaderboard'
import { Table, Typography, Image, Row } from 'antd'
import DefaultImage from '../assets/default.jpg'
import dayjs from 'dayjs'
import { useParams } from 'react-router'
import coursesSelector from '../store/courses/selectors'
import { useSelector } from 'react-redux'

const Leaderboard = () => {
  const [data, setData] = useState()
  const { course_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find((course) => course.course_number === course_id)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (course_id) {
        const res = await getCourseLeaderboard({ course_id: course.pk })
        if (res.status === 200) {
          const data = res.data.map((d, i) => ({ ...d, key: i }))
          setData(data)
        }
      } else {
        const res = await getPlatformLeaderboard()
        if (res.status === 200) {
          const data = res.data.map((d, i) => ({ ...d, key: i }))
          setData(data)
        }
      }
    }
    fetchLeaderboard()
  }, [course_id])

  const columns = [
    {
      title: 'User',
      dataIndex: 'andrew_id',
      align: 'center',
      key: 'andrew_id',
      render: (_, { image, andrew_id }) => {
        return (
          <Row align="middle" justify="center">
            <Image src={image ? image : DefaultImage} width={50} style={{ borderRadius: '50%' }} />{' '}
            <Typography.Title level={5} className="ml-3">
              {andrew_id}
            </Typography.Title>
          </Row>
        )
      }
    },
    {
      title: 'Experience',
      dataIndex: course_id ? 'course_experience' : 'exp',
      key: 'exp',
      align: 'center'
    },
    {
      title: 'Date Joined',
      dataIndex: 'date_joined',
      key: 'date_joined',
      render: (_, { date_joined }) => {
        return dayjs(date_joined).format('MM/DD/YYYY')
      }
    }
  ]

  return (
    <div className="m-5">
      <Table dataSource={data} columns={columns} />
    </div>
  )
}

export default Leaderboard
