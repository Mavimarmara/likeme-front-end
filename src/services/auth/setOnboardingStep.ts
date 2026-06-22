import storageService from './storageService';

type OnboardingSnapshot = {
  registerCompletedAt?: unknown;
  objectivesSelectedAt?: unknown;
  privacyPolicyAcceptedAt?: unknown;
};

function readOnboardingSnapshot(envelope: unknown): OnboardingSnapshot | null {
  if (envelope == null || typeof envelope !== 'object') {
    return null;
  }
  const root = envelope as Record<string, unknown>;
  const data = root.data ?? root;
  if (data == null || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }
  const d = data as Record<string, unknown>;
  const nested = d.onboarding;
  const source =
    nested != null && typeof nested === 'object' && !Array.isArray(nested) ? (nested as Record<string, unknown>) : d;
  return source;
}

function hasBackendOnboardingProgress(snapshot: OnboardingSnapshot): boolean {
  return (
    snapshot.registerCompletedAt != null ||
    snapshot.objectivesSelectedAt != null ||
    snapshot.privacyPolicyAcceptedAt != null
  );
}

async function markWelcomeWhenBackendOnboardingHasProgress(snapshot: OnboardingSnapshot): Promise<void> {
  if (!hasBackendOnboardingProgress(snapshot)) {
    return;
  }
  const welcomeScreenAccessedAt = await storageService.getWelcomeScreenAccessedAt();
  if (!welcomeScreenAccessedAt) {
    await storageService.setWelcomeScreenAccessedAt(new Date().toISOString());
  }
}

export async function setOnboardingStep(envelope: unknown): Promise<void> {
  const source = readOnboardingSnapshot(envelope);
  if (!source) {
    return;
  }

  if (source.registerCompletedAt != null) {
    await storageService.setRegisterCompletedAt(String(source.registerCompletedAt));
  }
  if (source.objectivesSelectedAt != null) {
    await storageService.setObjectivesSelectedAt(String(source.objectivesSelectedAt));
  }
  if (source.privacyPolicyAcceptedAt != null) {
    await storageService.setPrivacyPolicyAcceptedAt(String(source.privacyPolicyAcceptedAt));
  }

  await markWelcomeWhenBackendOnboardingHasProgress(source);
}
