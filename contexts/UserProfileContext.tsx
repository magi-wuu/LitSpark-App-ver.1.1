import React, { createContext, useContext } from 'react';
import { useLocalStore } from '../hooks/useLocalStore';
import { defaultProfile, decodeProfile, UserProfile } from '../lib/learningState';
interface UserProfileContextType {
  profile: UserProfile;
  loaded: boolean;
  saving: boolean;
  dirty: boolean;
  error: 'load' | 'save' | null;
  retry: () => Promise<void>;
  flush: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateProfilePicture: (uri: string) => void;
}
const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);
export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: profile, update, ...storage } = useLocalStore('userProfile', defaultProfile, decodeProfile);
  const updateProfile = (updates: Partial<UserProfile>) => { void update(current => ({ ...current, ...updates })).catch(() => {}); };
  const updateProfilePicture = (uri: string) => updateProfile({ profilePicture: uri });
  return <UserProfileContext.Provider value={{ profile, ...storage, updateProfile, updateProfilePicture }}>{children}</UserProfileContext.Provider>;
};
export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error('useUserProfile must be used within a UserProfileProvider');
  return context;
}
