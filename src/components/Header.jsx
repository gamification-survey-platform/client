import { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Logo from '../assets/cmu-logo.svg'
import { useDispatch, useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import { persistor } from '../store/store'
import { logout } from '../store/user/userSlice'
import { Layout, Menu, Image, Typography, Badge, Dropdown, Button, Tag, Row } from 'antd'
import useMessage from 'antd/es/message/useMessage'
import {
  UserOutlined,
  PlusOutlined,
  BookOutlined,
  AntDesignOutlined,
  SettingOutlined,
  HomeOutlined,
  OrderedListOutlined,
  BellOutlined,
  MailOutlined
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
import MessageModal from './MessageModal'
import styles from '../styles/Header.module.css'

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
    label: 'Dashboard'
  },
  {
    key: '1',
    icon: <UserOutlined />,
    label: 'Profile'
  },
  {
    key: '2',
    icon: <BookOutlined />,
    label: 'Courses'
  },
  {
    key: '3',
    icon: <GiShoppingCart />,
    label: 'Store'
  },
  {
    key: '4',
    icon: <AntDesignOutlined />,
    label: 'Theme'
  },
  {
    key: '5',
    icon: <OrderedListOutlined />,
    label: 'Leaderboard'
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
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [messageApi, contextHolder] = useMessage()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [items, setItems] = useState(initialItems)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user && user.is_staff) {
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
          const data = res.data.map((notification, i) => {
            return {
              key: `${i}`,
              label: <Notification {...notification} />
            }
          })
          setNotifications(data)
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
        {collapsed || user.is_staff ? null : (
          <div className={styles.progressTriangleWrapper}>
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
            <Tag className="mr-3 py-1" color="gold">
              <Row>
                <div className="mr-1">Daily Streak:</div>
                <Badge color="gold" count={user.daily_streak} showZero={true} />
              </Row>
            </Tag>
            <MailOutlined
              className={styles.icon}
              role="button"
              onClick={() => setMessageModalOpen(true)}
            />
            <Dropdown
              menu={{ items: notifications }}
              trigger={['click']}
              onOpenChange={(open) => open && setUnreadCount(0)}>
              <Badge count={unreadCount} className={styles.badge}>
                <BellOutlined className={styles.icon} />
              </Badge>
            </Dropdown>
            <LinkContainer to="/" onClick={handleLogout} className="ml-3">
              <Typography.Text role="button">Logout</Typography.Text>
            </LinkContainer>
          </div>
        </Layout.Header>
        <Layout.Content>
          {children}
          <MessageModal open={messageModalOpen} setOpen={setMessageModalOpen} />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
export default AppHeader
