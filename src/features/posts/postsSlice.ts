import {
  createSlice,
  nanoid,
  createAsyncThunk,
  createSelector,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { client } from '../../api/client'
import { Post } from './post'

export type AddPost = {
  title: string;
  content: String;
  user: string;
}

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a: Post, b: Post) => b.date.localeCompare(a.date)
})

const extraFields: {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined
} = {
  status: 'idle',
  error: undefined
}

const initialState = postsAdapter.getInitialState(extraFields)

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost: AddPost) => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        // Use the `upsertMany` reducer as a mutating update utility
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // Use the `addOne` reducer for the fulfilled case
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  }
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state: RootState) => state.posts)

// 呼び出し型: selectPostsByUser(state, userId)
export const selectPostsByUser = createSelector(
  // input selector
  [selectAllPosts, (state, userId) => userId],
  // output selector
  // posts: selectAllPosts戻り値, userId: (state, userId) => userIdの戻り値
  (posts, userId) => posts.filter(post => post.user === userId)
)
