import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SongEntry } from './index';

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  SongDetail: { song: SongEntry };
};

export type RootTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  FavouritesTab: undefined;
  SetlistTab: undefined;
  SettingsTab: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type SongDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'SongDetail'>;

export type HomeTabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, T>;

