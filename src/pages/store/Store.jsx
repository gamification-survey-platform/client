import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import userSelector from '../../store/user/selectors'

const Store = () => {
  const user = useSelector(userSelector)
  const navigate = useNavigate()

  useEffect(() => {
    user && user.is_staff && navigate(-1)
  }, [])

  return <div>Store</div>
}

export default Store
