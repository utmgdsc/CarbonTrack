import { type User } from "../models/User";

export interface RootStackParamList {
  Home: undefined;
  LogIn: undefined;
  SignUp: undefined;
  DashBoard: undefined;
  Forum: undefined;
  FoodForum: undefined;
  EnergyForum: undefined;
  TransportationForum: undefined;
  FoodHistory: undefined;
  TransportationHistory: undefined;
  [key: string]: undefined;
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
  photoURL: string
  user: User
  rank: number
}
