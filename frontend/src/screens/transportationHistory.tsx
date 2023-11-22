import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Colors from '../../assets/colorConstants';
import { useFonts } from 'expo-font';
import { BarChart } from 'react-native-chart-kit';
import { TransportationAPI } from '../APIs/TransportationAPI';
import { type MonthlyEntry } from '../models/Transportation';


export default function TransportationHistory(): JSX.Element {

  const [expandedStates, setExpandedStates] = useState(Array(100).fill(false));
  const [monthlyData, setMonthlyData] = useState<MonthlyEntry[]>();

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
    void TransportationAPI.getTransportationsEntriesForUserUsingDataRange(new Date(2023, 1, 1), new Date(2023, 12, 1)).then((res) => {
      if (res != null) {
        if (res.monthlyData != null) {
          setMonthlyData(res.monthlyData)
          console.log(res)
        }
      }
      console.log(res)
    });
  }, [loaded])

  if (!loaded || monthlyData === undefined) {
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
                {/* Add more content here */}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
});
