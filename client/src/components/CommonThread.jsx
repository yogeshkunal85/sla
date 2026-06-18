import React from 'react';
// import './CommentThread.css';

export function CommentThread({ comments }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorLabel = (comment) => {
    if (comment.author_type === 'agent') {
      return comment.author_id ? `Agent #${comment.author_id}` : 'Agent';
    }
    return 'Customer';
  };

  if (comments.length === 0) {
    return (
      <div className="comment-thread-empty">
        <p>No comments yet.</p>
      </div>
    );
  }

  return (
    <div className="comment-thread">
      <h4>Comments ({comments.length})</h4>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <span className="comment-author">{getAuthorLabel(comment)}</span>
              <span className="comment-date">{formatDate(comment.created_at)}</span>
            </div>
            <div className="comment-body">{comment.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}