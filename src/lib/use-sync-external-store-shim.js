import { useSyncExternalStore } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

// React 19 provides useSyncExternalStore natively.
// However, with-selector might still need the package version or a safe wrapper.
// For now, we'll try to export the package version of with-selector which should be ESM compatible if bundled correctly.

export { useSyncExternalStore, useSyncExternalStoreWithSelector };
export default useSyncExternalStore;
