import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  name: string;
  email: string;
  address: string;
  mobile: string;
  gender: string;
  avatar: string | null;
}

const initialState: ProfileState = {
  name: '',
  email: '',
  address: '',
  mobile: '',
  gender:'',
  avatar: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      return { ...action.payload };
    },
    clearProfile: () => initialState,
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
