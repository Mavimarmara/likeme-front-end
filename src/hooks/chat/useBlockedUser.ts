import { useState, useCallback, useEffect } from 'react';
import { communityService } from '@/services';

function extractBlockedIds(data: any): string[] {
  return data?.userIds || data?.users?.map((u: any) => u.userId) || [];
}

export function useBlockedUser(targetUserId: string) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await communityService.getBlockedUsers();
      if (response.success && response.data) {
        setIsBlocked(extractBlockedIds(response.data).includes(targetUserId));
      }
    } catch {
      // non-critical — keep current state
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const block = useCallback(async () => {
    await communityService.blockUser(targetUserId);
    setIsBlocked(true);
  }, [targetUserId]);

  const unblock = useCallback(async () => {
    await communityService.unblockUser(targetUserId);
    setIsBlocked(false);
  }, [targetUserId]);

  const toggle = useCallback(async () => {
    if (isBlocked) {
      await unblock();
    } else {
      await block();
    }
  }, [isBlocked, block, unblock]);

  return { isBlocked, loading, checkStatus, block, unblock, toggle } as const;
}
