import {
  ACTIVITY_CREATED_PUSH_TYPE,
  ACTIVITY_REMINDER_PUSH_TYPE,
  pushNavigationTargetFromData,
} from './pushNotificationNavigation';

describe('pushNavigationTargetFromData', () => {
  it('abre atividade específica para confirmação de criação', () => {
    expect(
      pushNavigationTargetFromData({
        type: ACTIVITY_CREATED_PUSH_TYPE,
        activityId: 'activity-42',
      }),
    ).toEqual({
      screen: 'Activities',
      params: {
        initialTab: 'actives',
        focusActivityId: 'activity-42',
      },
    });
  });

  it('abre atividade específica para lembrete agendado', () => {
    expect(
      pushNavigationTargetFromData({
        type: ACTIVITY_REMINDER_PUSH_TYPE,
        activityId: 'activity-99',
      }),
    ).toEqual({
      screen: 'Activities',
      params: {
        initialTab: 'actives',
        focusActivityId: 'activity-99',
      },
    });
  });

  it('ignora payloads sem type conhecido', () => {
    expect(pushNavigationTargetFromData({ type: 'other', activityId: 'x' })).toBeNull();
    expect(pushNavigationTargetFromData(undefined)).toBeNull();
  });
});
