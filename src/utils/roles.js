const STUDENT = 'Student'
const TA = 'TA'
const INSTRUCTOR = 'Instructor'

const isInstructorOrTA = (role) => role === TA || role === INSTRUCTOR

export { STUDENT, TA, INSTRUCTOR, isInstructorOrTA }
