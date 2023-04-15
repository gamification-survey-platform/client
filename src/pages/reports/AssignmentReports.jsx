import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import coursesSelector from '../../store/courses/selectors'
import { useEffect, useState } from 'react'
import { Button, Slider, Table, Typography, Row, Col } from 'antd'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { getInstructorIpsatization } from '../../api/reports'
import useMessage from 'antd/es/message/useMessage'

const columns = [
  { title: 'Entity', dataIndex: 'entity', key: 'entity' },
  { title: 'Score', dataIndex: 'score', key: 'score' }
]

const AssignmentReport = () => {
  const { course_id, assignment_id } = useParams()
  const [messageApi, contextHolder] = useMessage()
  const courses = useSelector(coursesSelector)
  const course = courses.find(({ course_number }) => course_number === course_id)
  const [histogramData, setHistogramData] = useState()
  const [ipMin, setIpMin] = useState(0)
  const [ipMax, setIpMax] = useState(0)
  const [dataSource, setDataSource] = useState([])

  const fetchReport = async ({ ipsatization_MIN, ipsatization_MAX }) => {
    const resp = await getInstructorIpsatization({
      course_id: course.pk,
      assignment_id,
      ipsatization_MIN,
      ipsatization_MAX
    })
    if (resp.status === 200) {
      const { artifacts_id_and_scores_dict, entities, ipsatization_MIN, ipsatization_MAX } =
        resp.data
      const scores = Object.values(artifacts_id_and_scores_dict)
      setHistogramData(scores)
      setIpMin(ipsatization_MIN)
      setIpMax(ipsatization_MAX)
      const dataSource = []
      entities.forEach((entity, i) => {
        dataSource.push({ entity, score: scores[i].toFixed(2), key: entity })
      })
      setDataSource(dataSource)
    }
  }

  useEffect(() => {
    fetchReport({})
  }, [])

  const handleRecalibrate = async () => {
    if (ipMin >= ipMax)
      messageApi.open({
        type: 'error',
        content: 'Minimum Ipsatization value must tbe less than Maximum Ipsatization value'
      })
    else fetchReport({ ipsatization_MIN: ipMin, ipsatization_MAX: ipMax })
  }

  return (
    <div className="m-5">
      {contextHolder}
      <Row>
        <Col span={12}>
          <div
            style={{
              width: '100%',
              height: 300
            }}>
            {histogramData ? <ChartWrapper type="histogram" data={histogramData} /> : null}
          </div>
          <Typography.Text>Minimum Ipsatization Value:</Typography.Text>
          <div className="w-100">
            <Slider min={1} max={100} value={ipMin} onChange={setIpMin} />
          </div>
          <Typography.Text>Maximum Ipsatization Value:</Typography.Text>
          <div className="w-100">
            <Slider min={1} max={100} value={ipMax} onChange={setIpMax} />
          </div>
          <div className="text-center">
            <Button onClick={handleRecalibrate}>Recalibrate</Button>
          </div>
        </Col>
        <Col span={12}>
          <Table columns={columns} dataSource={dataSource} />
        </Col>
      </Row>
    </div>
  )
}

export default AssignmentReport
