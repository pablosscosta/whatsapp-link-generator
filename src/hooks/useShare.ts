import { useState } from 'react';

/** Opens the device's share sheet and tracks whether sharing failed. */
export function useShare() {
  const [failed, setFailed] = useState(false);

  async function share(data: ShareData) {
    try {
      await navigator.share(data);
      setFailed(false);
    } catch (error) {
      // Closing the share sheet rejects with AbortError: the user changed their mind.
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Failed to share', error);
      setFailed(true);
    }
  }

  return { share, failed };
}
