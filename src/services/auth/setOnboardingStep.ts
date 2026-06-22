import storageService from './storageService';

export async function setOnboardingStep(envelope: unknown): Promise<void> {
  if (envelope == null || typeof envelope !== 'object') {
    return;
  }
  const root = envelope as Record<string, unknown>;
  const data = root.data ?? root;
  if (data == null || typeof data !== 'object' || Array.isArray(data)) {
    return;
  }
  const d = data as Record<string, unknown>;
  const nested = d.onboarding;
  const source =
    nested != null && typeof nested === 'object' && !Array.isArray(nested) ? (nested as Record<string, unknown>) : d;

  if (source.registerCompletedAt != null) {
    await storageService.setRegisterCompletedAt(String(source.registerCompletedAt));
  }
  if (source.objectivesSelectedAt != null) {
    await storageService.setObjectivesSelectedAt(String(source.objectivesSelectedAt));
  }
  if (source.privacyPolicyAcceptedAt != null) {
    await storageService.setPrivacyPolicyAcceptedAt(String(source.privacyPolicyAcceptedAt));
  }
}
