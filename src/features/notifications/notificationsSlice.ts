import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createEntityAdapter
} from '@reduxjs/toolkit'
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

const notificationsAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

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
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    // actionは使ってないから、呼び出し元もnullでOKなはず
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach(notification => {
        if (notification) notification.read = true
      })
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      notificationsAdapter.upsertMany(state, action.payload)
      Object.values(state.entities).forEach(notification => {
        // Any notifications we've read are no longer new
        if (notification) notification.isNew = !notification.read
      })
    })
  }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state: RootState) => state.notifications)