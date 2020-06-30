import React from 'react'
import Moment from 'moment'

import { CommentNodeType } from 'requests/comments'
import Subcomments from 'components/comments/Subcomments'

interface CommentProps {
  commentNode: CommentNodeType
}
const Comment: React.FC<CommentProps> = ({ commentNode }) => {
  return (
    <li
      className={`p-1 pl-3 w-full border-l ${
        commentNode.depth == 0 ? 'pb-3 border-b' : ''
      }`}
    >
      <div className="text-sm">
        <span className="font-bold">{commentNode.by.username}</span>
        <span className="text-gray-600">
          {' '}
          • {Moment(commentNode.createdAt).fromNow()}
        </span>
      </div>
      <p className="text-sm">{commentNode.content}</p>
      <div className="ml-1">
        <Subcomments parentId={commentNode.id} />
      </div>
    </li>
  )
}

export default Comment
