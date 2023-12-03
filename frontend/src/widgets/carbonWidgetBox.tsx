import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import Colors from '../../assets/colorConstants';
import { type carbonWidgetProps } from '../components/types';
import { useFonts } from 'expo-font';

const CarbonWidgetBox: React.FC<carbonWidgetProps> = ({ carbonUser }) => {
    const [loaded] = useFonts({
        Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
        Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
    });

    if (!loaded) {
        return <></>;
    }

    return (
    <View style={styles.boxContainer}>
        <View>
            <Text style={styles.header}> Carbon Footprint </Text>
            <Text style={styles.footprint}> getUserFootprint  </Text>

        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    boxContainer: {
        backgroundColor: Colors.DARKGREEN,
        borderRadius: 15,
        height: 150,
        width: 325,
        flexDirection: 'column',
        // ios shadow
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        // andriod shadow
        elevation: 5,
        alignItems: 'flex-start',
    },
    footprint:{
        textAlign: 'center',
        color: Colors.WHITE, 
        fontSize: 14,
        paddingLeft: '30%',
        paddingTop: '10%',
    },
    header: {
        color: Colors.WHITE, 
        textAlign: 'left',
        fontSize: 18,
        paddingTop: 25, 
        paddingLeft: 20,
        fontWeight: '700',
    },


});

export default CarbonWidgetBox;
