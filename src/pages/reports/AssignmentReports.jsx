import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import coursesSelector from '../../store/courses/selectors'
import { useEffect } from 'react'
import { getAssignmentReport } from '../../api/assignments'
import { Row, Slider, Typography } from 'antd'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { mockHistogramData } from '../../utils/mockData'

const AssignmentReport = () => {
  const { course_id, assignment_id } = useParams()
  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => course_number === course_id)

  useEffect(() => {
    const fetchReport = async () => {
      const resp = await getAssignmentReport({ coursePk: course.pk, assignment_id })
      if (resp.status === 200) console.log(resp.data)
    }
    //fetchReport()
  }, [])
  console.log(mockHistogramData)
  return (
    <div className="m-5">
      <div
        style={{
          width: '60%',
          height: 300
        }}>
        <ChartWrapper type="histogram" data={mockHistogramData} />
      </div>
      <Typography.Text>Minimum Ipsatization Value:</Typography.Text>
      <div className="w-25">
        <Slider min={1} max={100} />
      </div>
      <Typography.Text>Maximum Ipsatization Value:</Typography.Text>
      <div className="w-25">
        <Slider min={1} max={100} />
      </div>
    </div>
  )
}

export default AssignmentReport
