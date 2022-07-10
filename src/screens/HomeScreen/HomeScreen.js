import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Switch, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'

export default function HomeScreen(props) {

    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])
    const [isAnonymous, setIsAnonymous] = useState(false);

    const entityRef = firebase.firestore().collection('entities')
    const userID = props.extraData.id
    const userName = props.extraData.fullName

    useEffect(() => {
        entityRef
            // .where("authorID", "==", userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newEntities = []
                    querySnapshot.forEach(doc => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    setEntities(newEntities)
                },
                error => {
                    console.log(error)
                }
            )
    }, [])

    const onAddButtonPress = () => {
        if (entityText && entityText.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                text: entityText,
                authorID: userID,
                authorName: (isAnonymous)? 'anonymous' : userName,
                createdAt: timestamp,
            };
            entityRef
                .add(data)
                .then(_doc => {
                    setEntityText('')
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    const renderEntity = ({item, index}) => {
        return (
            <View style={styles.entityContainer}>
                <Text>
                    {item.authorName}
                </Text>
                <Text style={styles.entityText}>
                    {index}. {item.text}
                </Text>
            </View>
        )
    }

    const toggleSwitch = () => setIsAnonymous(previousState => !previousState);

    return (
        <View style={styles.container}>
            <Button 
                title="Signout" 
                onPress={() => {
                    firebase
                        .auth()
                        .signOut()
                        .then(() => {
                            console.log('user Signed out!')
                            navigation.navigate('Login');
                        })
                    }
                }/>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add new entity'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEntityText(text)}
                    value={entityText}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <Switch
                    trackColor={{false: '#ffffff', true: '#34cceb'}}
                    onValueChange={toggleSwitch}
                    value={isAnonymous}
                />
            </View>
            { entities && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={entities}
                        renderItem={renderEntity}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>
    )
}

