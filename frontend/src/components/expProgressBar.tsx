import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../assets/colorConstants';
import { getUserLevel } from '../models/User';
import { type ExpProgressBarProps } from './types';

const ExpProgressBar: React.FC<ExpProgressBarProps> = ({ thisUser }) => {
    const lvl = getUserLevel(thisUser.overall_score); 
    // testing--const lvl = 7;
    const lvlThresh = [250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000];
    const maxExp = lvlThresh[lvl - 1];

    const curr = thisUser.overall_score;
    // testing--const curr = 14039;

  const progress = (curr / maxExp) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.progressBar}>
                <View style={[styles.currProgression, { width: `${progress}%` }]} />
            </View>
            <View style={styles.textBox}>
                <View style={styles.levelContainer}> 
                    <Text style={styles.texts}> Level: {lvl}</Text>
                </View>
                <View style={styles.progContainer}> 
                    <Text style={styles.texts}> {`${curr}/${maxExp}`}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 250,
        marginVertical: 4,
    },
    progressBar: {
        flexDirection: 'row',
        height: 5,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        overflow: 'hidden',
    },
    currProgression:{
        backgroundColor: Colors.TEAL, 
        height: '100%', 
        
    },
    levelContainer:{
        flex: 1,
        justifyContent: 'flex-start',
        paddingLeft: 5,
    }, 
    texts:{
        marginTop: 5,
        color: Colors.WHITE, 
        fontSize: 12,
    },
    progContainer:{
        justifyContent: 'flex-end',
    },
    textBox:{
        flexDirection: 'row'
    }
});

export default ExpProgressBar;
