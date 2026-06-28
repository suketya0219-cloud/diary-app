import type { Activity } from '@/types/events';
import { MOCK_ACTIVITIES } from '@/mock/events';

let _activities: Activity[] = [...MOCK_ACTIVITIES];

export const activityStore = {
  get: () => _activities,
  set: (activities: Activity[]) => { _activities = activities; },
  getIncluded: () => _activities.filter((a) => a.includedInDiary),
};
