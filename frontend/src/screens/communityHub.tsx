import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { UsersAPI } from '../APIs/UsersAPI';
import { getUserLevel, type RankUser } from '../models/User';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

interface Challenge {
  id: number;
  name: string;
  description: string;
  deadline: string;
}

export default function DashBoardScreen(): JSX.Element {
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/MontserratThinRegular.ttf'),
    Josefin: require('../../assets/fonts/JosefinSansThinRegular.ttf'),
  });

  const [topUsersMonthly, setMonthlyUsers] = useState<RankUser[]>([]);
  const [topUsersYearly, setYearlyUsers] = useState<RankUser[]>([]);
  const [topUsersOverall, setOverallUsers] = useState<RankUser[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const MonthlyLeaderboard = (): JSX.Element => {
    return (
      <View>
        <ScrollView style={styles.scrollLeaderBoardContainer} horizontal>
          <FlatList
            data={topUsersMonthly}
            keyExtractor={(item) => item.rank.toString()}
            style={styles.flatListContainer}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={[styles.item, styles.rankItem]}>{item.rank}</Text>
                <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.item, styles.nameItem]}>
                  {item.name}
                </Text>
                <Text style={styles.item}>{item.footprint}</Text>
                <Text style={styles.item}>{getUserLevel(item.score)}</Text>
              </View>
            )}
            nestedScrollEnabled
          />
        </ScrollView>
      </View>
    );
  };

  const YearlyLeaderboard = (): JSX.Element => {
    return (
      <View>
        <ScrollView style={styles.scrollLeaderBoardContainer} horizontal>
          <FlatList
            data={topUsersYearly}
            keyExtractor={(item) => item.rank.toString()}
            style={styles.flatListContainer}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={[styles.item, styles.rankItem]}>{item.rank}</Text>
                <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.item, styles.nameItem]}>
                  {item.name}
                </Text>
                <Text style={styles.item}>{item.footprint}</Text>
                <Text style={styles.item}>{getUserLevel(item.score)}</Text>
              </View>
            )}
            nestedScrollEnabled
          />
        </ScrollView>
      </View>
    );
  };

  const OverallLeaderboard = (): JSX.Element => {
    return (
      <View>
        <ScrollView style={styles.scrollLeaderBoardContainer} horizontal>
          <FlatList
            data={topUsersOverall}
            keyExtractor={(item) => item.rank.toString()}
            style={styles.flatListContainer}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={[styles.item, styles.rankItem]}>{item.rank}</Text>
                <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.item, styles.nameItem]}>
                  {item.name}
                </Text>
                <Text style={styles.item}>{item.footprint}</Text>
                <Text style={styles.item}>{getUserLevel(item.score)}</Text>
              </View>
            )}
            nestedScrollEnabled
          />
        </ScrollView>
      </View>
    );
  };

  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly' | 'overall'>('monthly');

  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const data: Challenge[] = [
    {
      id: 1,
      name: 'Hunting For Treasure',
      description: 'Collect 5 unique life style pieces from a verified thrift/repurposing shop.',
      deadline: '2023-12-31',
    },
    {
      id: 2,
      name: 'Faux Moo Milk',
      description:
        'Learn to make your own dairy-free milk! Choose to make either soy, almond or cashew milk.',
      deadline: '2024-2-31',
    },
    {
      id: 3,
      name: 'Strut the Walkway',
      description:
        'Reduce your transportation distance by 2km this week and opt out for some public transportation, biking, or struting that walk way.',
      deadline: '2024-4-31',
    },
    {
      id: 4,
      name: 'Good re-Soup',
      description:
        'Reuse and repurpose your leftovers by turning it into stock!',
      deadline: '2024-4-31',
    },
    {
      id: 5,
      name: 'Meatless Mondays',
      description:
        'Try going vegitarian (or vegan for a bigger challenge) for an entire Monday',
      deadline: '2024-4-31',
    },
    // Add more items here
  ];

  const toggleExpand = (itemId: number): void => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const renderListItem = ({ item }: { item: Challenge }): JSX.Element => {
    const isExpanded = expandedItem === item.id;

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Text style={styles.itemName}>{item.name}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.descriptionText}>Description: {item.description}</Text>
            <Text style={styles.descriptionText}>Deadline: {item.deadline}</Text>
            <TouchableOpacity style={styles.acceptButton}>
              <Text>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    void UsersAPI.getTopUsers(10).then(async (res) => {
      if (res != null) {
        if (
          res.top_monthly_users != null &&
          res.top_yearly_users != null &&
          res.top_overall_users != null
        ) {
          setMonthlyUsers(res.top_monthly_users);
          setYearlyUsers(res.top_yearly_users);
          setOverallUsers(res.top_overall_users);
          console.log(res.top_overall_users);
        }
      }
    });
  }, [loaded]);

  const onRefresh = (): void => {
    // Simulate a refresh action (e.g., fetch new data)
    setRefreshing(true);

    void UsersAPI.getTopUsers(10).then(async (res) => {
      if (res != null) {
        if (
          res.top_monthly_users != null &&
          res.top_yearly_users != null &&
          res.top_overall_users != null
        ) {
          setMonthlyUsers(res.top_monthly_users);
          setYearlyUsers(res.top_yearly_users);
          setOverallUsers(res.top_overall_users);
          console.log(res.top_overall_users);
        }
      }
    });

    setTimeout(() => {
      setRefreshing(false); // Set refreshing to false after data is fetched
    }, 2000); // Simulating a 2-second delay
  };

  if (!loaded) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0000ff" />
        }
        style={styles.scrollContainer}
      >
        <View style={styles.halfScreen}>
          <ImageBackground
            source={{
              uri: 'https://us.123rf.com/450wm/valeriysurujiu/valeriysurujiu2005/valeriysurujiu200500237/147058440-dark-green-bokeh-on-nature-defocus-art-abstract-blur-background.jpg',
            }}
            style={styles.imageBackground}
          >
            <View style={styles.headerBox}>
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Community Hub</Text>
                <Text style={styles.discription}>Welcome to our Community Page!</Text>
                <Text style={styles.discription}>
                  Discover your eco-friendly rank, challenge yourself with sustainability quests,
                  and connect with like-minded individuals. Embrace the green movement and unleash
                  your competitive spirit while making the world a better place.
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.leaderBoardWidgetContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header2}>Leaderboard</Text>

            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
                onPress={() => setActiveTab('monthly')}
              >
                <Text style={styles.tabText}>Monthly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'yearly' && styles.activeTab]}
                onPress={() => setActiveTab('yearly')}
              >
                <Text style={styles.tabText}>Yearly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'overall' && styles.activeTab]}
                onPress={() => setActiveTab('overall')}
              >
                <Text style={styles.tabText}>Overall</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.leaderBoardHeader}>
              <Text style={[styles.headerItem, styles.rankItem]}>#</Text>
              <Text style={[styles.headerItem, styles.nameItem]}>Name</Text>
              <Text style={styles.headerItem}>Footprint</Text>
              <Text style={styles.headerItem}>Level</Text>
            </View>

            <View>
              {activeTab === 'monthly' ? (
                <MonthlyLeaderboard />
              ) : activeTab === 'yearly' ? (
                <YearlyLeaderboard />
              ) : (
                <OverallLeaderboard />
              )}
            </View>
          </View>
        </View>

        <View style={styles.leaderBoardWidgetContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header2}>All Challenges</Text>
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
    </View>
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
    height: 350,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header:{
    fontSize: 36,
    color: Colors.WHITE,
    fontWeight: '700',
  },
  header2: {
    fontSize: 24,
    marginBottom: 20,
    color: Colors.WHITE,
    fontWeight: '700',
  },
  discription: {
    paddingTop: 15,
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: '400',
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
    width: 350,
    alignSelf: 'center',
    marginTop: 25,
    // ios shadow
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    // andriod shadow
    elevation: 5,
  },
  leaderBoardHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 20,
    borderColor: Colors.LIGHTFGREEN,
  },
  headerItem: {
    flex: 1,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.WHITE,
    fontSize: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    textAlign: 'left',
    color: Colors.WHITE,
    fontSize: 14,
    justifyContent: 'center'
  },
  rankItem: {
    flex: 0.5,
  },
  nameItem: {
    flex: 1.5,
  },
  scrollLeaderBoardContainer: {
    maxHeight: 150,
    width: 325,
  },
  scrollChallengesContainer: {
    maxHeight: 300,
    marginTop: 15,
    width: 325,

  },
  itemContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.DARKDARKGREEN,
    marginBottom: 10,
    width: '90%'
  },
  itemName: {
    fontWeight: '500',
    fontSize: 16,
    color: Colors.WHITE,
  },
  expandedContent: {
    marginTop: 10,
    backgroundColor: Colors.DARKGREEN2,
    borderRadius: 10,
    padding: 10
  },
  descriptionText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  acceptButton: {
    backgroundColor: Colors.LIGHTFGREEN,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  flatListContainer: {
    width: 350,
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 15,
    alignSelf: 'center',

  },
  tab: {
    width: 100,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.TRANSGREENLOGOUT,
    marginHorizontal: '2%',
    justifyContent: 'center'

  },
  activeTab: {
    backgroundColor: Colors.TRANSGREENLOGOUT,
    color: Colors.WHITE,
  },
  tabText: {
    fontWeight: '700',
    color: Colors.WHITE,
    alignSelf: 'center',
  },
});
