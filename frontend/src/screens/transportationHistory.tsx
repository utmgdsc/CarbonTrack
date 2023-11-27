import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Colors from '../../assets/colorConstants';
import { useFonts } from 'expo-font';
import { BarChart } from 'react-native-chart-kit';
import { TransportationAPI } from '../APIs/TransportationAPI';
import { type TransportationEntry, type MonthlyEntry } from '../models/Transportation';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../components/types';
import WidgetBox from '../widgets/widgetBox';
export type StackNavigation = StackNavigationProp<RootStackParamList>;


export default function TransportationHistory(): JSX.Element {

  const [expandedStates, setExpandedStates] = useState(Array(100).fill(false));
  const [monthlyData, setMonthlyData] = useState<MonthlyEntry[]>();
  const [startDate] = useState<Date>(new Date(2023, 8, 1));
  const [endDate] = useState<Date>(new Date(2023, 11, 1));
  const navigation = useNavigation<StackNavigation>();
  const [transportationEntry, setTransportationEntry] = useState<TransportationEntry>();

  const toggleExpanded = (index: number): void => {
    const updatedStates = [...expandedStates];
    const currentState = updatedStates[index];

    if (typeof currentState === 'boolean') {
      updatedStates[index] = !currentState;
      setExpandedStates(updatedStates);
    }
  };

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  useEffect(() => {
    void TransportationAPI.getTransportationEntriesForUserUsingDataRange(
      startDate, endDate).then((res) => {
      if (res != null) {
        if (res.monthlyData != null) {
          setMonthlyData(res.monthlyData)
        }
      }
    });
    void TransportationAPI.getTransportationMetricForToday().then((res) => {
      if (res != null) {
        setTransportationEntry(res)
      }
    });
  }, [endDate, loaded, startDate, navigation])

  if (!loaded || monthlyData === undefined || transportationEntry === undefined) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {monthlyData.map((chart, index) => (
          <View key={index}>
            <TouchableOpacity onPress={() => toggleExpanded(index)} style={styles.tab}>
              <Text style={styles.tabTitle}>{chart.month}</Text>
            </TouchableOpacity>
            {Boolean(expandedStates[index]) && (
              <View style={styles.expandedContent}>
                <Text style={styles.tabText}>Emissions from transportation in {chart.month}</Text>
                <View style={styles.chartContainer}>
                  <BarChart
                    style={styles.chart}
                    data={{
                      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                      datasets: [
                        {
                          data: chart.data,
                        },
                      ],
                    }}
                    width={300}
                    height={200}
                    yAxisSuffix=" k"
                    yAxisLabel="Carbon Footprint" // Add yAxisLabel here
                    fromZero
                    chartConfig={{
                      backgroundColor: Colors.BLACK,
                      backgroundGradientFrom: Colors.WHITE,
                      backgroundGradientTo: Colors.WHITE,
                      decimalPlaces: 2,
                      color: (opacity = 1) => Colors.DARKLIMEGREEN,
                      labelColor: (opacity = 1) => Colors.DARKLIMEGREEN,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                      },
                    }}
                    verticalLabelRotation={0}
                    showValuesOnTopOfBars
                    withInnerLines={false}
                    withHorizontalLabels={false}
                  />
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.widgetContainer}>
      <View style={styles.widgetBoarder}>
          <TouchableOpacity 
          onPress={() => {
                      navigation.navigate('TransportationEntryEdit');
                    }}
                  >
                    <WidgetBox title="This Week's Entry" content={transportationEntry.carbon_emissions.toString()} />
                    </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.LIGHTFGREEN,
  },
  scrollContainer: {
    paddingTop: 60,
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: Colors.LIGHTFGREEN,
  },
  tab: {
    backgroundColor: Colors.DARKGREEN,
    padding: 25,
    borderRadius: 10,
    marginBottom: 20,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Montserrat',
    color: Colors.DARKLIMEGREEN,
  },
  expandedContent: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
  },
  chartContainer: {
    overflow: 'hidden',
  },
  chart: {
    marginVertical: 8,
    marginHorizontal: 8,
    alignSelf: 'center',
    marginLeft: -50,
  },
  widgetContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  widgetBoarder: {
    padding: 10,
  }
});
