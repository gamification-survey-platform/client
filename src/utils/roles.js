const STUDENT = 'Student'
const TA = 'TA'
const INSTRUCTOR = 'Instructor'

const isInstructorOrTA = (role) => role === TA || role === INSTRUCTOR

const isStudent = (role) => role === STUDENT

export { STUDENT, TA, INSTRUCTOR, isInstructorOrTA, isStudent }
