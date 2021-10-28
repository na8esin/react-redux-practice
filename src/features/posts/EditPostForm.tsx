import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector, ReactEvent } from '../../app/hooks';
import { useHistory, RouteComponentProps } from 'react-router-dom'

import { postUpdated, selectPostById } from './postsSlice'

type EditPostFormProps = RouteComponentProps<{ postId: string }>;

export const EditPostForm = ({ match }: EditPostFormProps) => {
  const { postId } = match.params

  const post = useAppSelector(state => selectPostById(state, postId))

  // AddPostFormと比べて初期値が入るようになった
  const [title, setTitle] = useState(post?.title ?? "")
  const [content, setContent] = useState(post?.content ?? "")

  const dispatch = useDispatch()
  const history = useHistory()

  // 以下イベントハンドラ
  const onTitleChanged = (e: ReactEvent) => setTitle(e.target.value)
  const onContentChanged = (e: ReactEvent) => setContent(e.target.value)

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postUpdated({ id: postId, title, content }))
      history.push(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  )
}