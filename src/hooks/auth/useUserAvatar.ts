import { useState, useEffect } from 'react';
import { storageService } from '@/services';

export function useUserAvatar() {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    storageService.getUser().then((user) => setUri(user?.picture ?? null));
  }, []);

  return uri;
}
