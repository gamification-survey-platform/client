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
  const [currentPage, setCurrentPage] = useState(1)
  const course = courses.find((course) => course.course_number === course_id)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      let response
      if (course_id) {
        response = await getCourseLeaderboard({ course_id: course.pk })
      } else {
        response = await getPlatformLeaderboard()
      }

      var data = null
      if (course_id) {
        const res = await getCourseLeaderboard({ course_id: course.pk })
        if (res.status === 200) {
          data = res.data.sort((a, b) => b.course_experience - a.course_experience)
        }
      } else {
        const res = await getPlatformLeaderboard()
        if (res.status === 200) {
          data = res.data.sort((a, b) => b.exp - a.exp)
        }
      }

      // Map over the data to assign rankings, giving the same rank to users with the same experience.
      let rank = 0
      let prevExperience = null
      const dataWithRanking = data.map((d, index) => {
        if (course_id) {
          // Increment rank only if the current experience is less than the previous one.
          if (prevExperience !== d.course_experience) {
            rank = index + 1
            prevExperience = d.course_experience
          }
        } else {
          if (prevExperience !== d.exp) {
            rank = index + 1
            prevExperience = d.exp
          }
        }
        return { ...d, key: index, ranking: rank }
      })

      setData(dataWithRanking)
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
        const renderTrophy = ranking < 4
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

  const paginationConfig = {
    defaultPageSize: 20,
    onChange: (page) => {
      setCurrentPage(page)
    }
  }

  return (
    <div className="m-5">
      {gamified_mode(user) ? (
        <Table
          pagination={paginationConfig}
          rowClassName={(record, index) => {
            const isFirstPage = currentPage === 1
            if (course_id && isFirstPage) {
              if (index < 1) return styles.tableRowLime6
              else if (index < 2) return styles.tableRowLime4
              else if (index < 3) return styles.tableRowLime2
              else return styles.tableRowLime1
            } else if (isFirstPage) {
              if (index < 1) return styles.tableRowLime6
              else if (index < 2) return styles.tableRowLime4
              else if (index < 3) return styles.tableRowLime2
              else return styles.tableRowLime1
            } else {
              return styles.tableRowLime1
            }
          }}
          dataSource={data}
          columns={columns}
        />
      ) : (
        <div className="h4">Currently unavailable</div>
      )}
    </div>
  )
}

export default Leaderboard
