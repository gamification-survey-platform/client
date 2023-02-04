
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import DefaultImage from '../assets/default.jpg'

const courses = [
    {
        course_number: 1,
        course_name: 'Foundations of Software Engineering',
        syllabus: 'Syllabus',
        semester: 'Spring 2023',
        visible: true,
        users: []
    },
    {
        course_number: 2,
        course_name: 'Software Design and Architecture',
        syllabus: 'Syllabus',
        semester: 'Spring 2023',
        visible: true,
        users: []
    }
]

const Home = () => {
    return (
        <Container fluid className="d-flex mt-5">
            {courses.map((course, i) => (
                <div key={i}>
                    <Card style={{ width: '18rem' }} className="m-3">
                        <Card.Img variant="top" src={DefaultImage} />
                        <Card.Body>
                            <Card.Title>{course.course_name}</Card.Title>
                            <Card.Text>
                                {course.semester}
                            </Card.Text>
                            <Button variant="primary" href={`/courses/${course.course_number}/details`} className="m-1">Course Details</Button>
                            <Button variant="primary" href={`/courses/${course.course_number}/assignments`} className="m-1">Assignments</Button>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </Container>
    )
}

export default Home