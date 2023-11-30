import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Colors from '../../assets/colorConstants';
import type { RootStackParamList } from '../components/types';
import type { StackNavigationProp } from '@react-navigation/stack';
export type StackNavigation = StackNavigationProp<RootStackParamList>;

interface User {
  rank: number;
  name: string;
  footprint: number;
  level: number;
}

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

  const topUsersMonthly: User[] = [
    { rank: 1, name: 'User 1', footprint: 90, level: 10 },
    { rank: 2, name: 'User 2', footprint: 100, level: 9 },
    { rank: 3, name: 'User 3', footprint: 110, level: 9 },
    { rank: 4, name: 'User 4', footprint: 115, level: 8 },
    { rank: 5, name: 'User 5', footprint: 120, level: 8 },
    { rank: 6, name: 'User 6', footprint: 125, level: 7 },
    { rank: 7, name: 'User 7', footprint: 130, level: 7 },
    { rank: 8, name: 'User 8', footprint: 135, level: 7 },
    // Monthly Leaderboard
    // Add more user data up to rank 10
  ];
  const topUsersOverall: User[] = [
    { rank: 1, name: 'User 1', footprint: 80, level: 14 },
    { rank: 2, name: 'User 2', footprint: 90, level: 13 },
    { rank: 3, name: 'User 3', footprint: 110, level: 9 },
    { rank: 4, name: 'User 4', footprint: 115, level: 8 },
    { rank: 5, name: 'User 5', footprint: 120, level: 8 },
    { rank: 6, name: 'User 6', footprint: 125, level: 7 },
    { rank: 7, name: 'User 7', footprint: 130, level: 7 },
    { rank: 8, name: 'User 8', footprint: 135, level: 7 },
    // Overall LeaderBoard
    // Add more user data up to rank 10
  ];
  // User's monthly rank
  const userRankMonthly: User = { rank: 89, name: 'Squishyhoshi', footprint: 200, level: 5 };
  // User's yearly/overall rank
  const userRankOverall: User = { rank: 89, name: 'Squishyhoshi', footprint: 200, level: 5 };

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
                <Text style={styles.item}>{item.level}</Text>
              </View>
            )}
            nestedScrollEnabled
          />
        </ScrollView>
        <View style={styles.leaderBoardBottom}>
          <Text style={[styles.item, styles.rankItem]}>{userRankMonthly.rank}</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.item, styles.nameItem]}>
            {userRankMonthly.name}
          </Text>
          <Text style={styles.item}>{userRankMonthly.footprint}</Text>
          <Text style={styles.item}>{userRankMonthly.level}</Text>
        </View>
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
                <Text style={styles.item}>{item.level}</Text>
              </View>
            )}
            nestedScrollEnabled
          />
        </ScrollView>
        <View style={styles.leaderBoardBottom}>
          <Text style={[styles.item, styles.rankItem]}>{userRankOverall.rank}</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.item, styles.nameItem]}>
            {userRankOverall.name}
          </Text>
          <Text style={styles.item}>{userRankOverall.footprint}</Text>
          <Text style={styles.item}>{userRankOverall.level}</Text>
        </View>
      </View>
    );
  };

  const [activeTab, setActiveTab] = useState<'monthly' | 'overall'>('monthly');

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

  if (!loaded) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
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
            <Text style={styles.header}>Leaderboard</Text>

            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
                onPress={() => setActiveTab('monthly')}
              >
                <Text style={styles.tabText}>Monthly</Text>
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

            <View>{activeTab === 'monthly' ? <MonthlyLeaderboard /> : <OverallLeaderboard />}</View>
          </View>
        </View>

        <View style={styles.leaderBoardWidgetContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>All Challenges:</Text>
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
    height: 350,
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
  leaderBoardHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 20,
    borderColor: Colors.LIGHTFGREEN,
  },
  leaderBoardBottom: {
    flexDirection: 'row',
    borderTopWidth: 1.5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 10,
    paddingTop: 5,
    borderColor: Colors.LIGHTFGREEN,
  },
  headerItem: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.WHITE,
    fontFamily: 'Montserrat',
    fontSize: 19,
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
    fontSize: 16,
    marginLeft: 20,
    fontFamily: 'Montserrat',
  },
  rankItem: {
    flex: 0.5,
  },
  nameItem: {
    flex: 1.5,
  },
  scrollLeaderBoardContainer: {
    maxHeight: 150,
    width: 500,
  },
  scrollChallengesContainer: {
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
  descriptionText: {
    color: Colors.WHITE,
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '700',
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
    justifyContent: 'space-between',
    paddingHorizontal: 70,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.LIGHTFGREEN,
  },
  activeTab: {
    backgroundColor: Colors.LIGHTFGREEN,
  },
  tabText: {
    fontWeight: '700',
    fontFamily: 'Montserrat',
    color: Colors.WHITE,
  },
});