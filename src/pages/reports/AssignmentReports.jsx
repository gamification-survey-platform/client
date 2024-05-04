import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { Table, Typography, message } from 'antd'
import { CSVLink } from 'react-csv'
import coursesSelector from '../../store/courses/selectors'
import { getAssignmentArtifactReviewsGrade } from '../../api/reports'

const { Title } = Typography

const AssignmentReport = () => {
  const { course_id, assignment_id } = useParams()
  const courses = useSelector(coursesSelector)
  const [reportData, setReportData] = useState([])

  const course = courses.find((course) => course.course_number === course_id)

  const columns = [
    {
      title: 'Andrew ID',
      dataIndex: 'reviewing',
      key: 'reviewing',
      width: '40%',
      sorter: (a, b) => a.reviewing.localeCompare(b.reviewing) // Alphabetical sorting
    },
    {
      title: 'Score',
      dataIndex: 'average_score',
      key: 'average_score',
      width: '20%',
      sorter: (a, b) => a.average_score - b.average_score, // Numerical sorting
      render: (score) => (score ? parseFloat(score).toFixed(2) : 'No grades')
    },
    {
      title: 'Course Number',
      dataIndex: 'course_number',
      key: 'course_number',
      width: '25%'
    },
    {
      title: 'Assignment ID',
      dataIndex: 'assignment_id',
      key: 'assignment_id',
      width: '15%'
    }
  ]

  useEffect(() => {
    if (course && course.pk) {
      const fetchData = async () => {
        try {
          const response = await getAssignmentArtifactReviewsGrade({
            course_id: course.pk,
            assignment_id
          })
          if (response.status === 200) {
            const formattedData = response.data.map((item) => ({
              ...item,
              average_score: item.average_score
                ? parseFloat(item.average_score).toFixed(2)
                : 'No grades',
              course_number: course.course_number
            }))
            setReportData(formattedData)
          } else {
            message.error('Failed to fetch report data')
          }
        } catch (error) {
          message.error(`Error: ${error.message}`)
        }
      }

      fetchData()
    }
  }, [course?.pk, assignment_id])

  return (
    <div className="m-5">
      <Title level={2}>Assignment Grade Report</Title>
      <Table dataSource={reportData} columns={columns} />
      <CSVLink
        data={reportData}
        headers={[
          { label: 'Andrew ID', key: 'reviewing' },
          { label: 'Score', key: 'average_score' },
          { label: 'Course Number', key: 'course_number' },
          { label: 'Assignment ID', key: 'assignment_id' }
        ]}
        filename={`assignment-grade-report-${course_id}-${assignment_id}.csv`}
        className="btn btn-primary"
        style={{ marginTop: '20px' }}>
        Export to CSV
      </CSVLink>
    </div>
  )
}

export default AssignmentReport
