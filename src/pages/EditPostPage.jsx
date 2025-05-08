import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../config/supabase';
import PostForm from '../components/PostForm';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data.author_id !== user?.id) {
          navigate('/');
          return;
        }

        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase
        .from('posts')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    try {
      setDeleting(true);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="loading-container">Loading post...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="glass-panel post-page">
      <div className="flex justify-between items-start mb-6">
        <Link to="/" className="btn btn-outline">
          <FaArrowLeft className="mr-2" />
          Back to all posts
        </Link>
        <div className="flex gap-2">
          <Link
            to="/posts/new"
            className="btn btn-primary"
          >
            <FaPlus className="mr-2" />
            Create New Post
          </Link>
          <button
            className="btn btn-delete delete-button"
            onClick={handleDelete}
            disabled={deleting}
            style={{ minWidth: 44 }}
          >
            <FaTrash className="mr-2" />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      
      {post && (
        <PostForm 
          post={post}
          onSubmit={handleSubmit}
          isEditMode={true}
          loading={loading}
        />
      )}
    </div>
  );
};

export default EditPostPage;