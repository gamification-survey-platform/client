import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getStudentReport } from '../../api/reports'
import ChartWrapper from '../../components/visualization/ChartWrapper'

const StudentReport = () => {
  const { course_id, assignment_id, artifact_id } = useParams()
  const [report, setReport] = useState()

  useEffect(() => {
    const fetchReport = async () => {
      const res = getStudentReport({ course_id, assignment_id, artifact_id })
      if (res.status === 200) setReport(res.data)
    }
    fetchReport()
  }, [])
  console.log(report)
  return (
    <div>
      <ChartWrapper data={{}} type="bar" />
    </div>
  )
}

export default StudentReport
