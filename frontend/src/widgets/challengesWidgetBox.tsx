import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../assets/colorConstants';
import { type challengesProps } from '../components/types';
import { useFonts } from 'expo-font';


const ChallengesWidget: React.FC<challengesProps> = ({ challenges }) => {
    const [loaded] = useFonts({
        Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
        Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
        });
    
    const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null);

    const handleChallengePress = (challengeId: number): void => {
    setExpandedChallenge((prev) => (prev === challengeId ? null : challengeId));
    };

    if (!loaded) {
        return <></>;
    }

    return (
        <View style={styles.challengeBox}>
            <Text style={styles.header}> Your Challenges </Text>
            {challenges.map((chal) => (
            <View key={chal.id} style={styles.challengeContainer}>
                <TouchableOpacity onPress={() => handleChallengePress(chal.id)}>
                    <Text style={styles.challengeTitle}>{chal.title}</Text>
                </TouchableOpacity>
                {expandedChallenge === chal.id && (
                <Text style={styles.challengeDescription}>{chal.description}</Text>
                )}
            </View>
            ))}
        </View>
        );
    };

const styles = StyleSheet.create({
    challengeBox:{
        backgroundColor: Colors.DARKGREEN,
        padding: 10, 
        borderRadius: 10,
    },
    challengeContainer: {
        padding: 10,
        borderBottomWidth: 1,
        backgroundColor: Colors.DARKGREEN2, 
        borderRadius: 10,
        margin: 5
        },
    challengeTitle: {
        fontSize: 16,
        color: Colors.WHITE,
    },
    challengeDescription: {
        marginTop: 5,
        color: Colors.BLACK
    },
    header: {
        fontSize: 18, 
        color: Colors.WHITE,
        margin: 10,
        fontWeight: '700',

    }
});

export default ChallengesWidget;
