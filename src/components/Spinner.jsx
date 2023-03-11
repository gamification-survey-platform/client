import { PacmanLoader } from 'react-spinners'

const Spinner = ({ show }) => {
  const styles = {
    position: 'absolute',
    marginLeft: -50,
    marginTop: -50,
    top: '50%',
    left: '50%'
  }
  return show ? <PacmanLoader size={50} style={styles} color="#36d7b7" /> : null
}

export default Spinner
