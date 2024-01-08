import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  ImageBackground,
} from 'react-native';
import Colors from '../../../assets/colorConstants';
import { useFonts } from 'expo-font';
import { BarChart } from 'react-native-chart-kit';
import { EnergyAPI } from '../../APIs/EnergyAPI';
import {
  type EnergyEntry,
  type MonthlyEntry,
  type EnergyEntryRecommendation,
} from '../../models/Energy';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../../components/types';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

interface Recommendation {
  id: number;
  name: string;
  description: string;
}

export default function EnergyHistory(): JSX.Element {
  const [expandedStates, setExpandedStates] = useState(Array(100).fill(false));
  const [monthlyData, setMonthlyData] = useState<MonthlyEntry[]>();
  const [startDate] = useState<Date>(new Date(2023, 8, 1));
  const [endDate] = useState<Date>(new Date(2024, 3, 30));
  const navigation = useNavigation<StackNavigation>();
  const [energyEntry, setEnergyEntry] = useState<EnergyEntry>();
  const [recommendationForToday, setRecommendationForToday] = useState<EnergyEntryRecommendation>();

  const toggleExpanded = (index: number): void => {
    const updatedStates = [...expandedStates];
    const currentState = updatedStates[index];

    if (typeof currentState === 'boolean') {
      updatedStates[index] = !currentState;
      setExpandedStates(updatedStates);
    }
  };

  const [loaded] = useFonts({
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  useEffect(() => {
    void EnergyAPI.getEnergyEntriesForUserUsingDataRange(startDate, endDate).then((res) => {
      if (res != null) {
        if (res.monthlyData != null) {
          setMonthlyData(res.monthlyData);
        }
      }
    });
    void EnergyAPI.getEnergyMetricForToday().then((res) => {
      if (res != null) {
        setEnergyEntry(res);
      }
    });
    void EnergyAPI.getEnergyRecommendationForToday().then((res) => {
      if (res != null) {
        setRecommendationForToday(res);
      }
    });
  }, [endDate, loaded, startDate, navigation]);

  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const checkRecommendations = (): Recommendation[] => {
    if (recommendationForToday == null) {
      return []; // Return an empty array if recommendationForToday is null
    }

    // Populate data with recommendations if recommendationForToday is not null
    const data: Recommendation[] = [
      {
        id: 1,
        name: 'Heating Oil',
        description: recommendationForToday.heating_oil_recommendation,
      },
      {
        id: 2,
        name: 'Natural Gas',
        description: recommendationForToday.natural_gas_recommendation,
      },
      {
        id: 3,
        name: 'Electricity',
        description: recommendationForToday.electricity_recommendation,
      },
    ];

    return data;
  };

  const recommendations = checkRecommendations();

  const toggleExpand = (itemId: number): void => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const renderListItem = ({ item }: { item: Recommendation }): JSX.Element => {
    const isExpanded = expandedItem === item.id;

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Text style={styles.itemName}>{item.name}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.descriptionText}>Description: {item.description}</Text>
          </View>
        )}
      </View>
    );
  };

  if (!loaded || monthlyData === undefined || energyEntry === undefined) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={Colors.DARKDARKGREEN} />
          <Text style={styles.buttonText}> Decomposition </Text>
        </TouchableOpacity>
        <View style={styles.halfScreen}>
          <ImageBackground
            source={{
              uri: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*CuCqHwrVYZr2fuugoCo1lw.jpeg',
            }}
            style={styles.imageBackground}
          >
            <View style={styles.headerBox}>
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Energy Footprint</Text>
                <Text style={styles.discription}>
                  Your energy footprint is calculated based on your monthly utilities bill and you
                  province.
                </Text>
                <Text style={styles.discription}>
                  Fun Fact! Canada is the forth largest suppliers of oil.
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.leaderBoardWidgetContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>History</Text>
            <ScrollView style={styles.scrollHistoryContainer} horizontal>
              <FlatList
                data={monthlyData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View key={index}>
                    <TouchableOpacity onPress={() => toggleExpanded(index)} style={styles.tab}>
                      <Text style={styles.tabTitle}>{item.month}</Text>
                    </TouchableOpacity>
                    {Boolean(expandedStates[index]) && (
                      <View style={styles.historyExpandedContent}>
                        <Text style={styles.tabText}>Emissions from energy in {item.month}</Text>
                        <View style={styles.chartContainer}>
                          <BarChart
                            style={styles.chart}
                            data={{
                              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                              datasets: [
                                {
                                  data: item.data,
                                },
                              ],
                            }}
                            width={350}
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
                )}
                nestedScrollEnabled
                style={styles.flatListContainer}
              />
            </ScrollView>
          </View>
        </View>

        <View style={styles.recommendationContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerGreen}>Recommendations:</Text>
            <ScrollView style={styles.scrollChallengesContainer} horizontal>
              <FlatList
                data={recommendations}
                renderItem={renderListItem}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled
                style={styles.flatListContainer}
              />
            </ScrollView>
          </View>
        </View>
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
    flex: 1,
    backgroundColor: Colors.LIGHTFGREEN,
  },
  halfScreen: {
    flex: 1,
    height: 400,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    fontSize: 36,
    color: Colors.WHITE,
    fontWeight: '700',
  },
  headerGreen: {
    fontSize: 30,
    color: Colors.DARKGREEN,
    fontWeight: '700',
  },
  discription: {
    paddingTop: 15,
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: '500',
  },
  headerBox: {
    backgroundColor: Colors.BLACKTRANS,
    margin: 15,
    borderRadius: 10,
  },
  headerContainer: {
    marginHorizontal: 15,
    marginVertical: 20,
  },
  leaderBoardWidgetContainer: {
    backgroundColor: Colors.DARKGREEN,
    margin: 15,
    borderRadius: 15,
    height: 400,
    marginTop: 25,
  },
  recommendationContainer: {
    backgroundColor: Colors.GREYGREEN,
    margin: 15,
    borderRadius: 15,
    height: 350,
    marginTop: 25,
  },
  scrollChallengesContainer: {
    maxHeight: 250,
    maxWidth: 350,
    marginTop: 15,
  },
  scrollHistoryContainer: {
    maxHeight: 300,
    maxWidth: 350,
    marginTop: 15,
  },
  itemContainer: {
    justifyContent: 'center',
    width: '90%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.DARKGREEN2,
    marginBottom: 10,
  },
  itemName: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.WHITE,
  },
  expandedContent: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.DARKGREEN3,
    borderRadius: 10,
    width: '100%',
  },
  historyExpandedContent: {
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.TRANSGREEN,
    borderRadius: 10,
    width: '90%',
  },
  descriptionText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  flatListContainer: {
    width: 350,
  },
  tab: {
    justifyContent: 'center',
    height: 50,
    width: '90%',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: Colors.DARKGREEN2,
    marginTop: 15,
  },
  tabText: {
    fontWeight: '500',
    color: Colors.WHITE,
  },
  chartContainer: {
    overflow: 'hidden',
  },
  chart: {
    marginVertical: 8,
    marginHorizontal: 8,
    justifyContent: 'center',
    marginLeft: -50,
    borderRadius: 10,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: Colors.DARKDARKGREEN,
    fontSize: 16,
    fontWeight: '700',
  },
});
