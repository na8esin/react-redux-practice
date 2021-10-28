import React from 'react'
import { useAppSelector } from '../../app/hooks';
import { RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { selectPostById } from './postsSlice'

type SinglePostPageProps = RouteComponentProps<{ postId: string }>;

// React Router will pass in a match object as a prop that contains the URL information
export const SinglePostPage = ({ match }: SinglePostPageProps) => {
  const { postId } = match.params

  const post = useAppSelector(state => selectPostById(state, postId))

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  )
}