import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

const AssignmentSurvey = () => {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => navigate(`${location.pathname}/add`), [])
  return <div>Assignment Survey</div>
}

export default AssignmentSurvey
