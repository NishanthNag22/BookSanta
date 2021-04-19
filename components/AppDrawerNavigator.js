import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import SettingsScreens from '../screens/settingsScreen';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu from './CustomSideBarMenu';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator
    },
    MyDonations: {
        screen: MyDonationsScreen
    },
    Setting: {
        screen: SettingsScreens
    }
},
    {
        contentComponent: CustomSideBarMenu
    },
    {
        initialRouteName: 'Home'
    }
);