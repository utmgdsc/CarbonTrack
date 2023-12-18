import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../assets/colorConstants';
import { type carbonWidgetProps, type RootStackParamList } from '../components/types';
import { useFonts } from 'expo-font';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { UsersAPI } from '../APIs/UsersAPI';
import { type TransportationEntry } from '../models/Transportation';
import { TransportationAPI } from '../APIs/TransportationAPI';
import { type FoodEntry } from '../models/Food';
import { type EnergyEntry } from '../models/Energy';
import { FoodAPI } from '../APIs/FoodAPI';
import { EnergyAPI } from '../APIs/EnergyAPI';
import { type User } from '../models/User';
import ModalInfo from '../components/modalInfo';


export type StackNavigation = StackNavigationProp<RootStackParamList>;

const CarbonWidgetBox: React.FC<carbonWidgetProps> = ({ carbonUser }) => {
    const navigation = useNavigation<StackNavigation>();

    const [user, setUser] = useState<User | undefined>(undefined);
    const [transportationEntry, setTransportationEntry] = useState<TransportationEntry>();
    const [foodEntry, setFoodEntry] = useState<FoodEntry>();
    const [energyEntry, setEnergyEntry] = useState<EnergyEntry>();
    const [modalVisible, setModalVisible] = useState(false);

    const [loaded] = useFonts({
        Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
        Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
    });

    useEffect(() => {
        void UsersAPI.GetLoggedInUser().then((res) => {
            if (res != null) {
            setUser(res);
        }
        });
        void TransportationAPI.getTransportationMetricForToday().then((res) => {
            if (res != null) {
            setTransportationEntry(res);
        }
        });
        void FoodAPI.getFoodMetricForToday().then((res) => {
            if (res != null) {
            setFoodEntry(res);
        }
        });
        void EnergyAPI.getEnergyMetricForToday().then((res) => {
            if (res != null) {
            setEnergyEntry(res);
        }
        });
    }, []);

    const footprint = (
        Math.round(
        (energyEntry?.carbon_emissions ?? 0) +
        (foodEntry?.carbon_emissions ?? 0) +
        (transportationEntry?.carbon_emissions ?? 0)).toFixed(1)
    );
    
    if (
        !loaded ||
        user === undefined ||
        transportationEntry === undefined ||
        foodEntry === undefined ||
        energyEntry === undefined
        ) {
        return <></>;
    }
    
    const showModal = ():void => {
        setModalVisible(true);
    };
    
    const hideModal = ():void => {
        setModalVisible(false);
    };

    return (
    <View style={styles.boxContainer}>
        <Text style={styles.header}> Carbon Footprint </Text>
        
        <TouchableOpacity onPress={showModal} style={styles.lightBulbButton}>
            <Text style={styles.lightBulb}>💡</Text>
            <ModalInfo modalVisible={modalVisible} hideModal={hideModal} /> 
        </TouchableOpacity>
        
        <View style={styles.carbonBox}>
        
            <Text style={styles.footprint}> {footprint} kg CO₂ / week </Text>

            
        </View>
        <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('FootprintDecomp')}}>
            <Text style={styles.text}>View Decomposition    {`>>>`} </Text>
        </TouchableOpacity>
    </View>
    );
};

const styles = StyleSheet.create({
    boxContainer: {
        backgroundColor: Colors.DARKGREEN,
        borderRadius: 15,
        height: 190,
        width: 350,
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
        fontSize: 20,
        fontWeight: '600'
    },
    carbonBox:{
        marginTop: 30,
        width: '90%',
        height: '50%',
        borderRadius: 10,
        backgroundColor: Colors.DARKLIGHTDARKGREEN,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    header: {
        color: Colors.WHITE, 
        fontSize: 24,
        fontWeight: '700',
        left: 20,
        top: 20,
    },
    button:{
        position: 'absolute',
        top: '80%',
        padding: 10,
    },
    text:{
        color: Colors.WHITE,
        left: 132,
    },
    lightBulb: {
        fontSize: 20,
    },
    lightBulbButton:{
        position: 'absolute',
        left: 300,
        top: 20,
        shadowColor: Colors.WHITE,
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
        // andriod shadow
        elevation: 0,
    }


});

export default CarbonWidgetBox;
