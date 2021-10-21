import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PostState {
  id: string;
  title: string;
  content: string;
}

const initialState: PostState[] = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' }
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded(state, action: PayloadAction<PostState>) {
      state.push(action.payload)
    }
  }
})

export const { postAdded } = postsSlice.actions

export default postsSlice.reducer