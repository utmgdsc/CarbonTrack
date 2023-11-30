import { type User } from '../models/User';

export interface RootStackParamList {
  Home: undefined;
  LogIn: undefined;
  SignUp: undefined;
  MainApp: { screen: string } | undefined;
  DashBoard: undefined;
  Forum: undefined;
  FoodForum: undefined;
  CommunityHub: undefined;
  EnergyForum: undefined;
  TransportationForum: undefined;
  FoodHistory: undefined;
  TransportationHistory: undefined;
  [key: string]: { screen: string } | undefined
}

export interface GoogleSVGType {
  width: number;
  height: number;
}

export interface WidgetBoxProps {
  title: string;
  content: string;
}

export interface profileWidgetBoxProps {
  photoURL: string;
  user: User;
}
