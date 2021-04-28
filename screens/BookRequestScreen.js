import React, { Component } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BookRequestScreen extends Component {
    constructor() {
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            bookName: '',
            reasonToRequest: '',
            requestId: '',
            requestedBookName: '',
            bookStatus: '',
            docId: '',
            isBookRequestActive: '',
            userDocId: ''
        }
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7);
    }

    getBookRequest = () => {
        var bookRequest = db.collection('requestedBooks')
            .where('userId', '==', this.state.userId)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.data().bookStatus !== "received") {
                        this.setState({
                            requestId: doc.data().requestId,
                            requestedBookName: doc.data().bookName,
                            bookStatus: doc.data().bookStatus,
                            docId: doc.id
                        })
                        console.log("line 40 :", this.state.requestedBookName);
                        console.log("line 40 :", this.state.bookStatus);
                    }
                })
            })
    }

    getIsBookRequestActive() {
        db.collection('users')
            .where('emailId', '==', this.state.userId)
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                    this.setState({
                        isBookRequestActive: doc.data().isBookRequestActive,
                        userDocId: doc.id
                    })
                })
            })
    }

    addRequest = (bookName, reasonToRequest) => {
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId()
        db.collection('requestedBooks').add({
            "userId": userId,
            "bookName": bookName,
            "reasonToRequest": reasonToRequest,
            "requestId": randomRequestId,
            "bookStatus": "requested",
            "date": firebase.firestore.FieldValue.serverTimestamp()
        })
        this.getBookRequest()
        db.collection('users').where("emailId", "==", userId).get()
            .then()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    db.collection('users').doc(doc.id).update({
                        isBookRequestActive: true
                    })
                })
            })

        this.setState({
            bookName: '',
            reasonToRequest: ''
        })

        return alert("Book Requested Successfully")
    }

    receivedBooks = (bookName) => {
        var userId = this.state.userId
        var requestId = this.state.requestId
        db.collection('receivedBooks').add({
            "userId": userId,
            "bookName": bookName,
            "requestId": requestId,
            "bookStatus": "received",

        })
    }

    componentDidMount() {
        this.getIsBookRequestActive()
        this.getBookRequest()
    }

    updateBookRequestStatus = () => {
        db.collection('requestedBooks').doc(this.state.docId)
            .update({
                bookStatus: 'recieved'
            })
        db.collection('users').where('emailId', '==', this.state.userId).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    db.collection('users').doc(doc.id).update({
                        isBookRequestActive: false
                    })
                })
            })


    }
    sendNotification = () => {
        //to get the first name and last name
        db.collection('users').where('emailId', '==', this.state.userId).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var name = doc.data().firstName
                    var lastName = doc.data().lastName

                    // to get the donor id and book nam
                    db.collection('allNotifications').where('requestId', '==', this.state.requestId).get()
                        .then((snapshot) => {
                            snapshot.forEach((doc) => {
                                var donorId = doc.data().donorId
                                var bookName = doc.data().bookName

                                //targert user id is the donor id to send notification to the user
                                db.collection('allNotifications').add({
                                    "targetedUserId": donorId,
                                    "message": name + " " + lastName + " received the book " + bookName,
                                    "notificationStatus": "unread",
                                    "bookName": bookName
                                })
                            })
                        })
                })
            })
    }

    render() {

        if (this.state.isBookRequestActive === true) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ borderColor: "orange", borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10 }}>
                        <Text>Book Name</Text>
                        <Text>{this.state.requestedBookName}</Text>
                    </View>
                    <View style={{ borderColor: "orange", borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10 }}>
                        <Text> Book Status </Text>
                        <Text>{this.state.bookStatus}</Text>
                    </View>

                    <TouchableOpacity style={{ borderWidth: 1, borderColor: 'orange', backgroundColor: "orange", width: 300, alignSelf: 'center', alignItems: 'center', height: 30, marginTop: 30 }}
                        onPress={() => {
                            this.sendNotification()
                            this.updateBookRequestStatus();
                            this.receivedBooks(this.state.requestedBookName)
                        }}>
                        <Text>I recieved the book </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            return (
                // Form screen
                <View style={{ flex: 1 }}>
                    <MyHeader title="Request Book" navigation={this.props.navigation} />

                    <ScrollView>
                        <KeyboardAvoidingView style={styles.keyBoardStyle}>
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={"enter book name"}
                                onChangeText={(text) => {
                                    this.setState({
                                        bookName: text
                                    })
                                }}
                                value={this.state.bookName}
                            />
                            <TextInput
                                style={[styles.formTextInput, { height: 300 }]}
                                multiline
                                numberOfLines={8}
                                placeholder={"Why do you need the book"}
                                onChangeText={(text) => {
                                    this.setState({
                                        reasonToRequest: text
                                    })
                                }}
                                value={this.state.reasonToRequest}
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.addRequest(this.state.bookName, this.state.reasonToRequest);
                                }}
                            >
                                <Text>Request</Text>
                            </TouchableOpacity>

                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    keyBoardStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    formTextInput: {
        width: "75%",
        height: 35,
        alignSelf: 'center',
        borderColor: '#FFAb91',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 10,
    },
    button: {
        width: "75%",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: "#FF5722",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: 20
    },
})