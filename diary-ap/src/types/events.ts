export type EventStatus = 'draft' | 'shared' | 'confirmed' | 'completed' | 'cancelled';
export type ResponseStatus = 'pending' | 'accepted' | 'declined' | 'tentative';
export type ShareMethod = 'LINE' | 'メール' | '共有リンク' | 'アプリ招待';
export type PreparationSource = 'event_detail' | 'message' | 'weather' | 'place' | 'suggested';
export type ActivityType = 'calendar' | 'shared_event' | 'photo' | 'health' | 'note' | 'location';

export interface AppUser {
  id: string;
  displayName: string;
  avatar: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface EventRole {
  id: string;
  userId: string;
  title: string;
  source: PreparationSource;
  done: boolean;
}

export interface EventBelonging {
  id: string;
  label: string;
  ownerUserId: string | null;
  source: PreparationSource;
  checked: boolean;
}

export interface EventMessage {
  id: string;
  eventId: string;
  userId: string;
  text: string;
  sentAt: string;
}

export interface EventPhoto {
  id: string;
  eventId: string;
  userId: string;
  label: string;
  sharedAt: string;
}

export interface EventResponse {
  eventId: string;
  userId: string;
  status: ResponseStatus;
  respondedAt?: string;
}

export interface SharedEvent {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  location: string;
  place: Place | null;
  description: string;
  creatorUserId: string;
  participantIds: string[];
  status: EventStatus;
  diaryEnabled: boolean;
  sharedVia: ShareMethod[];
  calendarAddedUserIds: string[];
  history: string[];
  roles: EventRole[];
  belongings: EventBelonging[];
}

export interface WeatherForecast {
  date: string;
  area: string;
  summary: string;
  highC: number;
  lowC: number;
  rainProbability: number;
  wind: string;
  suggestion: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  occurredAt: string;
  includedInDiary: boolean;
  confidence: number;
  personId?: string;
  location?: string;
  category: string;
}

export interface UserMemory {
  id: string;
  userIds: string[];
  title: string;
  date: string;
  summary: string;
}
