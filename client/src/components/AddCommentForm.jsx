import React, { useState } from 'react';
// import './AddCommentForm.css';

export function AddCommentForm({ onSubmit, isLoading }) {
  const [commentData, setCommentData] = useState({
    comment: '',
    author_type: 'agent',
    author_id: null
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!commentData.comment.trim()) {
      newErrors.comment = 'Comment message is required';
    }

    if (!commentData.author_type) {
      newErrors.author_type = 'Author type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(commentData);
      setCommentData(prev => ({ ...prev, comment: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommentData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h4>Add Comment</h4>
      
      <div className="form-group">
        <label htmlFor="comment">Message *</label>
        <textarea
          id="comment"
          name="comment"
          value={commentData.comment}
          onChange={handleChange}
          rows={3}
          className={errors.comment ? 'error' : ''}
          disabled={isLoading}
          placeholder="Enter your comment..."
        />
        {errors.comment && <span className="error-text">{errors.comment}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="author_type">Author Type *</label>
        <select
          id="author_type"
          name="author_type"
          value={commentData.author_type}
          onChange={handleChange}
          className={errors.author_type ? 'error' : ''}
          disabled={isLoading}
        >
          <option value="agent">Agent</option>
          <option value="customer">Customer</option>
        </select>
        {errors.author_type && <span className="error-text">{errors.author_type}</span>}
      </div>

      <button
        type="submit"
        className="button-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
}