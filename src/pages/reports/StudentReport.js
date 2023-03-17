import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getStudentReport, getKeywords } from '../../api/reports'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { Divider, Typography } from 'antd'

const StudentReport = () => {
  const { course_id, assignment_id, artifact_id } = useParams()
  const [report, setReport] = useState()
  const [keywords, setKeywords] = useState()

  useEffect(() => {
    const fetchReport = async () => {
      const res = await getStudentReport({ course_id, assignment_id, artifact_id })
      if (res.status === 200) {
        res.data.label = ['strongly disagree', 'disagree', 'neutral', 'agree', 'strongly agree']
        setReport(res.data)
      }
    }
    fetchReport()
  }, [])

  useEffect(() => {
    const fetchKeywords = async () => {
      const res = await getKeywords({ course_id, assignment_id, artifact_id })
      if (res.status === 200) {
        setKeywords(res.data)
      }
    }
    fetchKeywords()
  }, [])

  return (
    <div className="m-5">
      <Typography.Title level={2} className="text-center">
        Student Report
      </Typography.Title>
      {report &&
        Object.keys(report.sections).map((k, i) => {
          const questions = report.sections[k]
          const data = { labels: report.label, data: questions }
          return (
            <div key={i}>
              <Typography.Title level={4}>{k}</Typography.Title>
              <div style={{ height: Object.keys(questions).length * 100 }}>
                <ChartWrapper type="stackedBarChart" data={data} />
              </div>
              <Divider />
            </div>
          )
        })}
      {keywords && (
        <>
          <Typography.Title level={3}>Review Word Frequency</Typography.Title>
          <div style={{ height: 400, width: 400 }}>
            <ChartWrapper type="wordcloud" data={keywords} />
          </div>
        </>
      )}
    </div>
  )
}

export default StudentReport
