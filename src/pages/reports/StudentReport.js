import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getKeywords, getStudentStatistics } from '../../api/reports'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { Divider, Typography } from 'antd'

const StudentReport = () => {
  const { course_id, assignment_id, artifact_id } = useParams()
  const [statistics, setStatistics] = useState()
  const [keywords, setKeywords] = useState()

  useEffect(() => {
    const fetchStatistics = async () => {
      const res = await getStudentStatistics({ course_id, assignment_id, artifact_id })
      if (res.status === 200) {
        res.data.label = ['strongly disagree', 'disagree', 'neutral', 'agree', 'strongly agree']
        setStatistics(res.data)
      }
    }
    fetchStatistics()
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
      {statistics &&
        Object.keys(statistics.sections).map((k, i) => {
          const questions = statistics.sections[k]
          const data = { labels: statistics.label, data: questions }
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
