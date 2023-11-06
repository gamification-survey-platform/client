import { useEffect, useState } from 'react'
import { getCourseLeaderboard, getPlatformLeaderboard } from '../api/leaderboard'
import { Table, Typography, Image, Row } from 'antd'
import DefaultImage from '../assets/default.jpg'
import { TrophyFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useParams } from 'react-router'
import coursesSelector from '../store/courses/selectors'
import { useSelector } from 'react-redux'
import styles from '../styles/Leaderboard.module.css'
import { gamified_mode } from '../gamified'
import userSelector from '../store/user/selectors'

const Leaderboard = () => {
  const user = useSelector(userSelector)
  const [data, setData] = useState()
  const { course_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find((course) => course.course_number === course_id)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (course_id) {
        const res = await getCourseLeaderboard({ course_id: course.pk })
        if (res.status === 200) {
          const data = res.data
            .sort((a, b) => b.course_experience - a.course_experience)
            .map((d, ranking) => ({ ...d, key: ranking, ranking: ranking + 1 }))
          setData(data)
        }
      } else {
        const res = await getPlatformLeaderboard()
        if (res.status === 200) {
          const data = res.data
            .sort((a, b) => b.exp - a.exp)
            .map((d, ranking) => ({ ...d, key: ranking, ranking: ranking + 1 }))
          setData(data)
        }
      }
    }
    fetchLeaderboard()
  }, [course_id])

  const columns = [
    {
      title: 'Ranking',
      dataIndex: 'ranking',
      align: 'center',
      key: 'ranking'
    },
    {
      title: 'User',
      dataIndex: 'andrew_id',
      align: 'center',
      key: 'andrew_id',
      render: (_, { image, andrew_id, ranking }) => {
        const renderTrophy = ranking < 10
        let trophyColor
        if (ranking === 1) trophyColor = 'gold'
        else if (ranking === 2) trophyColor = 'silver'
        else trophyColor = '#CD7F32'
        return (
          <Row align="left" style={{ paddingLeft: '30%' }}>
            {renderTrophy ? (
              <TrophyFilled className="mr-1" style={{ color: trophyColor, fontSize: '1rem' }} />
            ) : null}
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
      align: 'center',
      render: (_, { date_joined }) => {
        return <Row align="center">{dayjs(date_joined).format('MM/DD/YYYY')}</Row>
      }
    }
  ]

  return (
    <div className="m-5">
      {gamified_mode(user) ? (<Table
        rowClassName={(record, index) => {
          if (course_id) {
            if (index < 3) return styles.tableRowLime6
            else if (index < 6) return styles.tableRowLime4
            else if (index < 10) return styles.tableRowLime2
          } else {
            if (index < 5) return styles.tableRowLime6
            else if (index < 10) return styles.tableRowLime4
            else if (index < 20) return styles.tableRowLime2
          }
        }}
        dataSource={data}
        columns={columns}
      />) : (<div className='h4'> 
        Currently unavailable
      </div>)}
    </div>
  )
}

export default Leaderboard
