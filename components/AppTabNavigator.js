import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BookDonateScreen from '../screens/bookDonateScreen';
import BookRequestScreen from '../screens/bookRequestScreen';
import { AppStackNavigator } from './AppStackNavigator';

export const AppTabNavigator = createBottomTabNavigator({
    DonateBooks: {
        screen: AppStackNavigator,
        navigationOptions: {
            tabBarIcon: <Image source={require("../assets/request-list.png")} style={{ width: 20, height: 20 }} />,
            tabBarLabel: "Donate Books",
        }
    },
    BookRequest: {
        screen: BookRequestScreen,
        navigationOptions: {
            tabBarIcon: <Image source={require("../assets/request-book.png")} style={{ width: 20, height: 20 }} />,
            tabBarLabel: "Book Request",
        }
    }
});