import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../assets/colorConstants';
import { useFonts } from 'expo-font';
import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';



export type StackNavigation = StackNavigationProp<RootStackParamList>;


export default function WelcomeScreen(): JSX.Element {
    const [loaded] = useFonts({
        Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
        Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
    });

    const navigation = useNavigation<StackNavigation>();

    if (!loaded) {
        return <></>;
    }

    
    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={styles.heading}>Welcome to</Text>
                <Text style={styles.heading2}> Carbon Track! 🌱 </Text>
            </View>
            <View style={styles.paragraphContainer}>
                <Text style={styles.para1}>Did you know that as of 2020, Canadians have the second-biggest carbon footprint globally, averaging 17.8 t CO2 eq? </Text>
                <Text style={styles.para}>No need to worry --thats what we’re here for!</Text>
                <Text style={styles.para}>Our mission is to make tracking your Carbon Footprint a breeze. </Text>
                <Text style={styles.para}>Your job is to complete weekly quizzes about your habits to keep track of your carbon footprint score. 💫</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUpQuestions')}>
                    <Text style={styles.buttonLable}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.LIGHTFGREEN,
        paddingTop: 40,
    },
    paragraphContainer:{
        backgroundColor: Colors.LIGHTGREENBACK,
        width: '80%',
        height: '70%',
        borderRadius: 20,
        marginTop: 20
    },
    heading:{
        fontSize: 30, 
        fontWeight: '700',
        marginTop: 70,
        color: Colors.DARKGREEN,
    },
    heading2:{
        fontSize: 40, 
        fontWeight: '700',
        color: Colors.DARKGREEN3,
    },
    headingContainer:{
        margin: 0,
        padding: 10
    }, 
    button:{
        padding: 20,
        backgroundColor: Colors.LIGHTGREENBUTTON,
        width: 150,
        height: 60,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 20,
    },
    buttonLable:{
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'center',
    },
    para1:{
        marginTop: 30,
        marginHorizontal: 20,
        fontSize: 18, 
        color: Colors.DARKGREEN,
        margin: 10,
        fontWeight: '500',
    },
    para:{
        fontSize: 18, 
        color: Colors.DARKGREEN,
        marginHorizontal: 20,
        marginVertical: 15,
        fontWeight: '500',
    }
    });