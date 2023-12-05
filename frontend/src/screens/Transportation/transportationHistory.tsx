import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  FlatList,
} from 'react-native';
import Colors from '../../../assets/colorConstants';
import { useFonts } from 'expo-font';
import { BarChart } from 'react-native-chart-kit';
import { TransportationAPI } from '../../APIs/TransportationAPI';
import { type TransportationEntry, type MonthlyEntry } from '../../models/Transportation';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../../components/types';

export type StackNavigation = StackNavigationProp<RootStackParamList>;
interface Recommendation {
  id: number;
  name: string;
  description: string;
}

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
    Montserrat: require('../../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  useEffect(() => {
    void TransportationAPI.getTransportationEntriesForUserUsingDataRange(startDate, endDate).then(
      (res) => {
        if (res != null) {
          if (res.monthlyData != null) {
            setMonthlyData(res.monthlyData);
          }
        }
      }
    );
    void TransportationAPI.getTransportationMetricForToday().then((res) => {
      if (res != null) {
        setTransportationEntry(res);
      }
    });
  }, [endDate, loaded, startDate, navigation]);

  const data: Recommendation[] = [
    {
      id: 1,
      name: 'Vehicle',
      description:
        'The emissions from your vehicle is above the threshold, consider switching to an electrical vehicle.',
    },
    {
      id: 2,
      name: 'Car travel',
      description: 'Your car travel is above the treshold, try taking public transit instead.',
    },
    {
      id: 3,
      name: 'Motorbike',
      description: 'Your motorike travel is above the threshold, consider biking instead.',
    },
    // Add more items here
  ];

  const [expandedItem, setExpandedItem] = useState<number | null>(null);
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

  if (!loaded || monthlyData === undefined || transportationEntry === undefined) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.halfScreen}>
          <ImageBackground
            source={{
              uri: 'https://d20aeo683mqd6t.cloudfront.net/articles/title_images/000/044/226/medium/japanese-stations-s1330132109.jpg?2022',
            }}
            style={styles.imageBackground}
          >
            <View style={styles.headerBox}>
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Transportation Footprint</Text>
                <Text style={styles.discription}>
                  Your transportation footprint is calculated based on your travel habits and your
                  vehicle type.
                </Text>
                <Text style={styles.discription}>
                  Fun Fact! The transportation sector is responsible for 27 percent of greenhouse
                  gas (GHG) emissions in Canada.
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
                        <Text style={styles.tabText}>
                          Emissions from transportation in {item.month}
                        </Text>
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
                            width={380}
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
                data={data}
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
    fontSize: 30,
    color: Colors.WHITE,
    fontFamily: 'Montserrat',
    fontWeight: '700',
  },
  headerGreen: {
    fontSize: 30,
    color: Colors.DARKGREEN,
    fontFamily: 'Montserrat',
    fontWeight: '700',
  },
  discription: {
    paddingTop: 15,
    fontSize: 16,
    color: Colors.WHITE,
    fontFamily: 'Montserrat',
    fontWeight: '700',
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
    borderRadius: 10,
    height: 400,
    marginTop: 25,
  },
  recommendationContainer: {
    backgroundColor: Colors.GREYGREEN,
    margin: 15,
    borderRadius: 10,
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
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.DARKGREEN2,
    marginBottom: 10,
  },
  itemName: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: Colors.WHITE,
  },
  expandedContent: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.DARKGREEN3,
    borderRadius: 10,
    width: 320,
  },
  historyExpandedContent: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.DARKGREEN3,
    borderRadius: 10,
    width: 350,
  },
  descriptionText: {
    color: Colors.WHITE,
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '700',
  },
  flatListContainer: {
    width: 350,
  },
  tab: {
    height: 50,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.DARKGREEN2,
    backgroundColor: Colors.DARKGREEN2,
    marginTop: 15,
  },
  tabText: {
    fontWeight: '700',
    fontFamily: 'Montserrat',
    color: Colors.WHITE,
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
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    color: Colors.WHITE,
    textAlign: 'center',
  },
});
