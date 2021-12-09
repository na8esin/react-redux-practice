import React from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { useGetPostQuery } from '../api/apiSlice'

type SinglePostPageProps = RouteComponentProps<{ postId: string }>;

// React Router will pass in a match object as a prop that contains the URL information
export const SinglePostPage = ({ match }: SinglePostPageProps) => {
  const { postId } = match.params

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  let content
  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>

    )
  }

  return <section>{content}</section>
}