import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { client } from '../../api/client'

export type Notification = {
  read: boolean;
  isNew: boolean;
  date: string;
  user: string;
  id: string;
  message: string;
}

export const fetchNotifications = createAsyncThunk<any, void, { state: RootState }>(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const initialState: Notification[] = []

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: initialState,
  reducers: {
    // actionは使ってないから、呼び出し元もnullでOKなはず
    allNotificationsRead(state: Notification[], action) {
      state.forEach(notification => {
        notification.read = true
      })
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state: Notification[], action) => {
      state.push(...action.payload)
      state.forEach(notification => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectAllNotifications = (state: RootState) => state.notifications