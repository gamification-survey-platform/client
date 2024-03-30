import { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Logo from '../assets/cmu-logo.svg'
import { useDispatch, useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import { persistor } from '../store/store'
import { logout } from '../store/user/userSlice'
import { Layout, Menu, Image, Tooltip, Badge, Dropdown, Row } from 'antd'
import useMessage from 'antd/es/message/useMessage'
import {
  UserOutlined,
  BookOutlined,
  AntDesignOutlined,
  SettingOutlined,
  HomeOutlined,
  OrderedListOutlined,
  BellOutlined,
  FireOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { GiShoppingCart } from 'react-icons/gi'
import { MdPlusOne } from 'react-icons/md'
import ChartWrapper from './visualization/ChartWrapper'
import Bronze from '../assets/bronze.png'
import Silver from '../assets/silver.png'
import Gold from '../assets/gold.png'
import Diamond from '../assets/diamond.png'
import Master from '../assets/master.png'
import Grandmaster from '../assets/grandmaster.png'
import { getNotifications } from '../api/notifications'
import { setUser } from '../store/user/userSlice'
import Notification from './Notification'
import styles from '../styles/Header.module.css'
import DashboardJoyride from './DashboardJoyride'
import { gamified_mode } from '../gamified'
import AvatarBadge from '../assets/badges/Avatar-Alchemist.png'
import CommentCaptainSilverBadge from '../assets/badges/Silver/Comment-Captain.png' 
import CommentCaptainGoldBadge from '../assets/badges/Gold/Comment-Captain.png'
import PeerReviewGoldBadge from '../assets/badges/Gold/Peer-review-provided.png'

const rankings = [
  { title: 'Bronze', image: Bronze },
  { title: 'Silver', image: Silver },
  { title: 'Gold', image: Gold },
  { title: 'Diamond', image: Diamond },
  { title: 'Master', image: Master },
  { title: 'Grandmaster', image: Grandmaster }
]

const initialItems = [
  {
    key: '0',
    icon: <HomeOutlined />,
    label: <div className="Dashboard">Dashboard</div>
  },
  {
    key: '1',
    icon: <UserOutlined />,
    label: 'Profile'
  },
  {
    key: '2',
    icon: <BookOutlined />,
    label: <div className="courses">Courses</div>
  },
  {
    key: '3',
    icon: <GiShoppingCart />,
    label: <div className="store">Store</div>
  },
  {
    key: '4',
    icon: <AntDesignOutlined />,
    label: 'Theme'
  },
  {
    key: '5',
    icon: <OrderedListOutlined />,
    label: <div className="leaderboard">Leaderboard</div>
  },
  {
    key: '6',
    icon: <SettingOutlined />,
    label: 'Guide'
  }
]

const AppHeader = ({ children }) => {
  const user = useSelector(userSelector)
  const [collapsed, setCollapsed] = useState()
  const [messageApi, contextHolder] = useMessage()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [items, setItems] = useState(initialItems)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user && user.is_staff) {
      setItems(items.filter((item) => item.key !== '3' && item.key !== '4' && item.key !== '5'))
    } else if (user && !gamified_mode(user)) {
      setItems(
        items.filter(
          (item) => item.key !== '3' && item.key !== '4' && item.key !== '5' && item.key !== '6'
        )
      )
    } else if (user && user.level < 0) {
      setItems(items.filter((item) => item.key !== '4'))
    }

    if (user && user.daily_streak_increment) {
      messageApi.open({
        icon: <MdPlusOne size={'1.5em'} className="mr-1" />,
        content: 'Daily check in',
        style: {
          position: 'absolute',
          top: 0,
          right: 30,
          color: 'green'
        }
      })
      dispatch(setUser({ ...user, daily_streak_increment: false }))
    }
  }, [user])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications()
        if (res.status === 200) {
          const unreadNotifications = res.data.filter((notification) => !notification.is_read)
          setUnreadCount(unreadNotifications.length)
          setNotifications(res.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchNotifications()
  }, [])

  const handleLogout = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await persistor.pause()
    await persistor.flush()
    await persistor.purge()
    dispatch(logout())
    navigate('/')
  }

  const handleClick = (e) => {
    const { key } = e
    switch (key) {
      case '0':
        navigate('/dashboard')
        break
      case '1':
        navigate('/profile')
        break
      case '2':
        navigate('/courses')
        break
      case '3':
        navigate('/store')
        break
      case '4':
        navigate('/theme')
        break
      case '5':
        navigate('/leaderboard')
        break
      case '6':
        navigate('/guide')
        break
    }
  }
  const notificationElements = notifications.map((notification, i) => {
    return {
      key: `${i}`,
      label: <Notification {...notification} />
    }
  })

  const BadgeContainer = () => (
    <div style={{ 
      padding: '0px 0px',
      background: '#FCC200', 
      borderRadius: '15px', 
      transition: 'transform 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Tooltip title="Avatar Alchemist" color={'geekblue'} placement="left">
        <div style={{ margin: '0 4px' }}>
          <Image src={AvatarBadge} preview={false} width={50} height={50} />
        </div>
      </Tooltip>
      <Tooltip title="Comment Captain" color={'geekblue'} placement="left">
        <div style={{ margin: '0 4px' }}>
          <Image src={CommentCaptainSilverBadge} preview={false} width={50} height={50} />
        </div>
      </Tooltip>
      <Tooltip title="Comment Captain" color={'geekblue'} placement="left">
        <div style={{ margin: '0 4px' }}>
          <Image src={CommentCaptainGoldBadge} preview={false} width={50} height={50} />
        </div>
      </Tooltip>
      <Tooltip title="Peer Reviewer" color={'geekblue'} placement="left">
        <div style={{ margin: '0 4px' }}>
          <Image src={PeerReviewGoldBadge} preview={false} width={50} height={50} />
        </div>
      </Tooltip>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}
      <Layout.Sider collapsible onCollapse={(collapsed) => setCollapsed(collapsed)}>
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          onClick={handleClick}
          defaultSelectedKeys={['0']}
        />
        {collapsed || user.is_staff || !gamified_mode(user) ? null : (
          <div className={`gamification ${styles.progressTriangleWrapper}`}>
            <div className="text-center text-white">
              <Image width={100} src={rankings[user.level].image} />
              <p>
                Level {user.level}: {rankings[user.level].title}
              </p>
              <p>
                {user.exp} / {user.next_level_exp}
              </p>
            </div>
            <ChartWrapper type="progressTriangle" data={{ pct: user.exp / user.next_level_exp }} />
          </div>
        )}
      </Layout.Sider>
      <Layout className="site-layout">
        <Layout.Header className={styles.headerWrapper}>
          <LinkContainer to="/dashboard" className={styles.logo}>
            <Image src={Logo} preview={false} width={300} />
          </LinkContainer>
          <div>
            <BadgeContainer />
          </div>
          <Row>
            <Tooltip title="Start Tutorial" color={'gold'} placement="left">
              <div className="mr-3">
                <DashboardJoyride isFirstLogin={user?.is_first_login || false} />
              </div>
            </Tooltip>
            <Tooltip title="Daily streak" color={'gold'} placement="left">
              {!gamified_mode() ? null : (
                <div className="mr-3 daily-streak">
                  <FireOutlined className={styles.icon} />
                  <Badge
                    color="gold"
                    count={user.daily_streak}
                    showZero={true}
                    style={{ position: 'absolute' }}
                  />
                </div>
              )}
            </Tooltip>
            <Dropdown
              menu={{ items: notificationElements }}
              trigger={['click']}
              onOpenChange={(open) => {
                if (open) {
                  setUnreadCount(0)
                }
                if (open && unreadCount === 0) {
                  setNotifications(
                    notifications.map((notification) => ({ ...notification, is_read: true }))
                  )
                }
              }}>
              <div className="mr-3 notification" style={{ height: '3em', cursor: 'pointer' }}>
                <BellOutlined className={styles.icon} />
                <Badge count={unreadCount} style={{ position: 'absolute', bottom: 5 }} />
              </div>
            </Dropdown>
            <div className="logout">
              <LogoutOutlined className={styles.icon} role="button" onClick={handleLogout} />
            </div>
          </Row>
        </Layout.Header>
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    </Layout>
  )
}
export default AppHeader
