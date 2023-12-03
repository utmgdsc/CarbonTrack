import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Colors from '../../assets/colorConstants';
import { type challengesProps } from '../components/types';
import { useFonts } from 'expo-font';

const ChallengesWidget: React.FC<challengesProps> = ({ challenges }) => {
    const [loaded] = useFonts({
        Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
        Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
    });

    const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null);
    const containerHeight = useRef(new Animated.Value(0)).current;

    const handleChallengePress = (challengeId: number): void => {
        setExpandedChallenge((prev) => (prev === challengeId ? null : challengeId));
    };


    useEffect(() => {
    const expandedContentHeight = challenges.reduce((totalHeight, chal) => {
      return totalHeight + (expandedChallenge === chal.id ? 50 : 0); 
    }, 0);

    const newHeight = Math.max(50, 150 + expandedContentHeight); 

    Animated.timing(containerHeight, {
        toValue: 130 + newHeight,
        duration: 400,
        useNativeDriver: false
    }).start();
    }, [challenges, containerHeight, expandedChallenge]);

    if (!loaded) {
    return <></>;
    }

    return (
    <Animated.View style={[styles.challengeBox, { height: containerHeight }]}>
        <Text style={styles.header}> Your Challenges </Text>
        <View style={styles.challengeContainer}>
        {challenges.map((chal) => (
            <View key={chal.id} style={styles.challengeListContainer}>
            <TouchableOpacity onPress={() => handleChallengePress(chal.id)}>
                <Text style={styles.challengeTitle}>{chal.title}</Text>
                {expandedChallenge === chal.id && (
                <Text style={styles.challengeDescription}>{chal.description}</Text>
                )}
            </TouchableOpacity>
            </View>
        ))}
        </View>
    </Animated.View>
    );
    };

    const styles = StyleSheet.create({
    challengeBox: {
        backgroundColor: Colors.DARKGREEN,
        borderRadius: 15,
        justifyContent: 'center',
        width: 325,
        flexDirection: 'column',
        // ios shadow
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        // andriod shadow
        elevation: 5,
        margin: 10,
    },
    challengeContainer: {
        justifyContent: 'center',
        marginTop: 30,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10
    },
    challengeListContainer: {
        padding: 15,
        backgroundColor: Colors.DARKTRANS,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    challengeTitle: {
        fontSize: 16,
        color: Colors.WHITE,
        fontWeight: '600',
        
    },
    challengeDescription: {
        marginTop: 5,
        color: Colors.WHITE,
    },
    header: {
        color: Colors.WHITE,
        textAlign: 'left',
        fontSize: 18,
        paddingLeft: 20,
        fontWeight: '700',
        paddingBottom: 10,
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        zIndex: 1,
        marginBottom: 10
    },
    });

export default ChallengesWidget;
