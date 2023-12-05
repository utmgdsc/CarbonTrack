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
  SignUpQuestions: undefined;
  [key: string]: { screen: string } | undefined;
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
  user: User;
}

export interface carbonWidgetProps {
  carbonUser: User;
}

export interface challenge {
  id: number;
  title: string;
  description: string;
}
export interface challengesProps {
  challenges: challenge[];
}

export interface ExpProgressBarProps {
  thisUser: User,
}

export interface settingsPageProps {
  theUser?: User,
}
export interface editProfileProps {
  theUser?: User,
}
export interface updatePasswordProps {
  theUser?: User,
}


