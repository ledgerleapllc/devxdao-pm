import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '@stores/auth/actions';
import { useHistory } from 'react-router';
import { ReactComponent as DashboardIcon } from '@assets/icons/ic-dashboard.svg';
import { ReactComponent as AssignmentIcon } from '@assets/icons/ic-assign.svg';
import { ReactComponent as UsersIcon } from '@assets/icons/ic-users.svg';
import { ReactComponent as SettingIcon } from '@assets/icons/ic-setting.svg';
import { ReactComponent as LogoutIcon } from '@assets/icons/ic-logout.svg';

export const useSidebar = () => {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.authReducer?.user);

  useEffect(() => {
    if (user?.is_super_admin) {
      setItems([
        {
          key: 'dashboard',
          icon: DashboardIcon,
          label: 'Job Board',
          action: {
            to: '/app/job-board',
          }
        },
        {
          key: 'assignment',
          icon: AssignmentIcon,
          label: 'Assigned',
          action: {
            to: '/app/assign',
          }
        },
        {
          key: 'users',
          icon: UsersIcon,
          label: 'Users',
          action: {
            to:  '/app/users', 
          }
        },
        {
          key: 'setting',
          icon: SettingIcon,
          label: 'Settings',
          action: {
            to: '/app/settings',
          }
        },
        {
          key: 'logout',
          icon: LogoutIcon,
          label: 'Sign Out',
          action: {
            onClick: () => signout()
          } 
        },
      ]);
    } else if (user?.is_pa) {
      setItems([
        {
          key: 'dashboard',
          icon: DashboardIcon,
          label: 'My Jobs',
          action: {
            to: '/app/assign',
          }
        },
        {
          key: 'users',
          icon: UsersIcon,
          label: 'Users',
          action: {
            to:  '/app/users', 
          }
        },
        {
          key: 'setting',
          icon: SettingIcon,
          label: 'Settings',
          action: {
            to: '/app/settings',
          }
        },
        {
          key: 'logout',
          icon: LogoutIcon,
          label: 'Sign Out',
          action: {
            onClick: () => signout()
          } 
        },
      ]);
    }
  }, [user]);

  const signout = () => {
    dispatch(
      logout(
        () => {
          setTimeout(() => history.push('/auth/login'));
        },
        () => {}
      )
    )
  }

  return { items };
}