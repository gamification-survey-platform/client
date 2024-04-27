import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { Table, Typography, message } from 'antd';
import { CSVLink } from 'react-csv';
import coursesSelector from '../../store/courses/selectors';
import { getAssignmentArtifactReviewsGrade } from '../../api/reports';

const { Title } = Typography;

const AssignmentReport = () => {
  const { course_id, assignment_id } = useParams();
  const courses = useSelector(coursesSelector);
  const [reportData, setReportData] = useState([]);

  const course = courses.find(course => course.course_number === course_id);

  const columns = [
    {
      title: 'Andrew ID',
      dataIndex: 'reviewing',
      key: 'reviewing'
    },
    {
      title: 'Score',
      dataIndex: 'average_score',
      key: 'average_score',
      render: score => score.toFixed(2)  
    },
    {
      title: 'Course Number',
      dataIndex: 'course_number',
      key: 'course_number'
    },
    {
      title: 'Assignment ID',
      dataIndex: 'assignment_id',
      key: 'assignment_id'
    }
  ];

  useEffect(() => {
    if (course && course.pk) {
      const fetchData = async () => {
        try {
          const response = await getAssignmentArtifactReviewsGrade({ course_id: course.pk, assignment_id });
          if (response.status === 200) {
            setReportData(response.data.map(item => ({
              ...item,
              course_number: course.course_number 
            })));
          } else {
            message.error('Failed to fetch report data');
          }
        } catch (error) {
          message.error(`Error: ${error.message}`);
        }
      };

      fetchData();
    }
  }, [course?.pk, assignment_id]);  

  return (
    <div className="m-5">
      <Title level={2}>Assignment Grade Report</Title>
      <Table dataSource={reportData} columns={columns} />
      <CSVLink
        data={reportData}
        filename={`assignment-grade-report-${course_id}-${assignment_id}.csv`}
        className="btn btn-primary"
        style={{ marginTop: '20px' }}
      >
        Export to CSV
      </CSVLink>
    </div>
  );
};

export default AssignmentReport;