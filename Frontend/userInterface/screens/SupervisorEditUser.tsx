import React, { useState, useEffect } from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Text, Platform} from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/navigation/NavigationTypes";

type EditUserPageNavigationProp = StackNavigationProp<RootStackParamList, 'SupervisorEdit'>;
type RouteParams = { username: string };

const SupervisorEditUser: React.FC = () => {
    const navigation = useNavigation<EditUserPageNavigationProp>();
    const route = useRoute();
    const { username } = route.params as RouteParams;

    const [user, setUser] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        user_type: '',
    });
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage-users/?username=${username}`);
            const data = await response.json();
            if (response.ok && data.length > 0) {
                const userData = data[0];
                setUser({
                    name: userData.name,
                    email: userData.email,
                    phone_number: userData.phone_number,
                    address: userData.address,
                    user_type: userData.user_type,
                });
            } else {
                console.error('Error', data.error || 'Failed to fetch user details.');
            }
        } catch (error) {
            console.error('Error', 'Failed to fetch user details.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage-users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    edit_info: user,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                showAlert('Success', 'User updated successfully.');
                navigation.goBack();
            } else {
                console.error('Error', data.error || 'Error updating user.');
            }
        } catch (error) {
            console.error('Error', 'Failed to update user.');
        }
    };

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    const handleDeleteUser = async () => {
        if (Platform.OS === 'web') {
            if (window.confirm("Are you sure? This action cannot be undone.")) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/manage-users/`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username,
                            delete: true,
                        }),
                    });
                    if (response.ok) {
                        showAlert('Success', 'User deleted successfully.');
                        navigation.goBack();
                    } else {
                        console.error('Error', 'Error deleting user.');
                    }
                } catch (error) {
                    console.error('Error', 'Failed to delete user.');
                }
            }
        }
    };

    return (
        <ThemedView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View>
                    <TextInput
                        placeholder="Name"
                        value={user.name}
                        onChangeText={(text) => setUser({ ...user, name: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Email"
                        value={user.email}
                        onChangeText={(text) => setUser({ ...user, email: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Phone Number"
                        value={user.phone_number}
                        onChangeText={(text) => setUser({ ...user, phone_number: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Address"
                        value={user.address}
                        onChangeText={(text) => setUser({ ...user, address: text })}
                        style={styles.input}
                    />

                    <View style={styles.radioContainer}>
                        {['Rider', 'Driver'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={styles.radioButton}
                                onPress={() => setUser({ ...user, user_type: type[0] })}
                            >
                                <View style={user.user_type === type[0] ? styles.selectedRadio : styles.unselectedRadio} />
                                <Text>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleUpdateUser} style={styles.updateButton}>
                        <ThemedText style={styles.buttonText}>Update User</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleDeleteUser} style={styles.deleteButton}>
                        <ThemedText style={styles.buttonText}>Delete User</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ThemedText style={styles.buttonText}>Back</ThemedText>
                    </TouchableOpacity>
                </View>
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10 },
    radioContainer: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 15 },
    radioButton: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
    selectedRadio: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'blue', marginRight: 10 },
    unselectedRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: 'gray', marginRight: 10 },
    updateButton: { backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 10, marginBottom: 10 },
    deleteButton: { backgroundColor: 'red', padding: 15, alignItems: 'center', borderRadius: 10, marginBottom: 10 },
    backButton: { backgroundColor: 'gray', padding: 15, alignItems: 'center', borderRadius: 10 },
    buttonText: { color: 'white', fontSize: 16 },
});

export default SupervisorEditUser;
