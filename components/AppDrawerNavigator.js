import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu from './CustomSideBarMenu';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator
    },
    MyDonations: {
        screen: MyDonationsScreen
    },
    Notifications: {
        screen: NotificationsScreen
    },
    Settings: {
        screen: SettingsScreen
    }
},
    {
        contentComponent: CustomSideBarMenu
    },
    {
        initialRouteName: 'Home'
    }
);