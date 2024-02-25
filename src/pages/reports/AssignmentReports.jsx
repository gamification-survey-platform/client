import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import coursesSelector from '../../store/courses/selectors'
import { useEffect, useState } from 'react'
import { Button, Slider, Table, Typography, Row, Col } from 'antd'
import ChartWrapper from '../../components/visualization/ChartWrapper'
import { getInstructorIpsatization } from '../../api/reports'
import useMessage from 'antd/es/message/useMessage'
import { CSVLink } from 'react-csv'

const AssignmentReport = () => {
  const { course_id, assignment_id } = useParams();
  const [messageApi, contextHolder] = useMessage();
  const courses = useSelector(coursesSelector);
  const course = courses.find(({ course_number }) => course_number === course_id);
  const [histogramData, setHistogramData] = useState();
  const [ipMin, setIpMin] = useState(0);
  const [ipMax, setIpMax] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [downloadData, setDownloadData] = useState({});
  const [columns, setColumns] = useState([
    { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Score', dataIndex: 'score', key: 'score' },
    { title: 'Score1', dataIndex: 'score1', key: 'score1' },
    { title: 'Original Score', dataIndex: 'original', key: 'original' },
    { title: 'Score after Ipsatization', dataIndex: 'ipsatizedScore', key: 'ipsatizedScore' },
    // Add other columns here if needed
  ]);

  useEffect(() => {
    // This is where you can fetch your data from the backend
    // For now, we use placeholder data
    const mockData = [
      { studentId: 's123', score: 85, score1: 75, original: 75, ipsatizedScore: 80 },
      { studentId: 's124', score: 90, score1: 75, original: 75, ipsatizedScore: 88 },
      { studentId: 's125', score: 80, score1: 75, original: 75, ipsatizedScore: 85 },
      { studentId: 's126', score: 80, score1: 75, original: 75, ipsatizedScore: 85 },
      { studentId: 's127', score: 80, score1: 75, original: 75, ipsatizedScore: 85 },
      { studentId: 's128', score: 80, score1: 75, original: 75, ipsatizedScore: 85 },
    ];
    setDataSource(mockData);

    // Previous logic (you might replace or integrate this with real data fetching)
    // fetchReport({});
  }, []); // Removed the fetchReport dependency to avoid conflict with placeholder data

  // You can integrate actual fetching logic here and combine it with the static data if necessary
  const fetchReport = async ({ ipsatization_MIN, ipsatization_MAX }) => {
    const resp = await getInstructorIpsatization({
      course_id: course.pk,
      assignment_id,
      ipsatization_MIN,
      ipsatization_MAX
    })
    if (resp.status === 200) {
      const {
        artifacts_id_and_scores_dict,
        entities,
        ipsatization_MIN,
        ipsatization_MAX,
        assignment_type
      } = resp.data
      columns[0].title = assignment_type
      setColumns(columns)
      const scores = Object.values(artifacts_id_and_scores_dict)
      setHistogramData(scores)
      setIpMin(ipsatization_MIN)
      setIpMax(ipsatization_MAX)
      const dataSource = []
      const downloadData = []
      entities.forEach((entity, i) => {
        dataSource.push({ entity, score: scores[i].toFixed(2), key: entity })
        downloadData.push({ [assignment_type]: entity, score: scores[i].toFixed(2) })
      })
      setDataSource(dataSource)
      setDownloadData(downloadData)
    }
  }

  useEffect(() => {
    fetchReport({})
  }, [])

  const handleRecalibrate = async () => {
    if (ipMin >= ipMax)
      messageApi.open({
        type: 'error',
        content: 'Minimum Ipsatization value must be less than Maximum Ipsatization value'
      })
    else fetchReport({ ipsatization_MIN: ipMin, ipsatization_MAX: ipMax })
  }

  return (
    <div className="m-5">
      {contextHolder}
      <Row gutter={[16, 16]}> {/* Add gutter for spacing between columns */}
        <Col span={24}> {/* Changed this from 12 to 24 to take full width */}
          <div style={{ width: '100%', height: 'auto' }}> {/* Adjusted height to 'auto' */}
            {histogramData ? <ChartWrapper type="histogram" data={histogramData} /> : null}
          </div>
          {/* <Typography.Text>Minimum Ipsatization Value:</Typography.Text>
          <div className="w-100">
            <Slider min={1} max={100} value={ipMin} onChange={setIpMin} />
          </div>
          <Typography.Text>Maximum Ipsatization Value:</Typography.Text>
          <div className="w-100">
            <Slider min={1} max={100} value={ipMax} onChange={setIpMax} />
          </div>
          <div className="text-center">
            <Button onClick={handleRecalibrate}>Recalibrate</Button>
          </div> */}
          {/* Table below the sliders */}
          <Table columns={columns} dataSource={dataSource} />
          <Row className="mt-3" justify="center">
            {Object.keys(downloadData).length > 0 && (
              <Button type="primary">
                <CSVLink
                  data={downloadData}
                  filename={'scores.csv'}
                  style={{ textDecoration: 'none', color: 'white' }}>
                  Download Scores
                </CSVLink>
              </Button>
            )}
          </Row>
        </Col>
      </Row>
    </div>
)

}

export default AssignmentReport
