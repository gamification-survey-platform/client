export const mockUser = {
  andrewId: 'admin1',
  email: 'admin1@example.com',
  role: 'admin'
}

export const mockMembers = [
  {
    andrewId: 'id',
    role: 'instructor',
    team: 't1'
  },
  {
    andrewId: 'id',
    role: 'instructor',
    team: 't1'
  }
]

export const mockCourses = [
  {
    course_number: 1,
    course_name: 'Foundations of Software Engineering',
    syllabus:
      'In this course, you will learn about software engineering paradigms that have shaped the software industry over the past fe...',
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

export const mockAssignments = [
  {
    name: 'test',
    id: 1,
    type: 'Individual',
    score: 100,
    availableDate: new Date(),
    dueDate: new Date()
  },
  {
    name: 'test2',
    id: 2,
    type: 'Group',
    score: 100,
    availableDate: new Date(),
    dueDate: new Date()
  }
]

export const mockSurvey = {
  instruction: 'Instructions for survey',
  information: 'Information for survey',
  sections: []
}

export const mockCourse = { ...mockCourses[0] }
