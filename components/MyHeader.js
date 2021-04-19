import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements';

const MyHeader = (props) => {
    return (
        <Header
            leftComponent={<Icon name='bars' type='font-awesome' color='#696969' onPress={() => props.navigation.toggleDrawer()} />}
            centerComponent={{ text: props.title, style: { color: '#90A5A9', fontSize: 20, fontWeight: "bold", } }}
            backgroundColor="#eaf8fe"
        />
    );
};

export default MyHeader;