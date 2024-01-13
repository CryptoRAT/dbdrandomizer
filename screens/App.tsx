import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GenerateRandomSurvivor from '../components/GenerateRandomSurvivor'; // Make sure to provide the correct path

const App: React.FC = () => {
    return (
        <View style={styles.container}>
            <GenerateRandomSurvivor />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;
