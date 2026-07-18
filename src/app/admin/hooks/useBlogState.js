'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';
import { confirmDialog } from '@/components/ConfirmDialog';

export default function useBlogState({ setSuccessMsg, actionLoading, setActionLoading }) {
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImg, setPostImg] = useState('');
  const [postAuthor, setPostAuthor] = useState('');

  const alert = (msg) => { showToast(msg, 'error'); };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
      if (!error && data) setPosts(data);
    } catch (err) { console.warn(err); }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault(); setActionLoading(true); setSuccessMsg(null);
    const slug = postTitle.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    const newPost = { title: postTitle, slug, excerpt: postExcerpt, content: postContent, image_url: postImg || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', author: postAuthor || 'Staff Beast', published_at: new Date().toISOString() };
    try {
      const { data, error } = await supabase.from('blog_posts').insert([newPost]).select();
      if (error) throw error;
      if (data) setPosts([data[0], ...posts]);
      setSuccessMsg('¡Artículo de blog publicado exitosamente!');
      setPostTitle(''); setPostExcerpt(''); setPostContent(''); setPostImg(''); setPostAuthor('');
    } catch (err) { alert(err.message); }
    finally { setActionLoading(false); }
  };

  const handleDeletePost = async (postId) => {
    if (!await confirmDialog('¿Deseas eliminar este artículo?')) return;
    try { const { error } = await supabase.from('blog_posts').delete().eq('id', postId); if (error) throw error; setPosts(posts.filter(p => p.id !== postId)); } catch (err) { alert(err.message); }
  };

  return {
    posts, postTitle, postExcerpt, postContent, postImg, postAuthor,
    setPosts, setPostTitle, setPostExcerpt, setPostContent, setPostImg, setPostAuthor,
    fetchPosts, handleCreatePost, handleDeletePost,
  };
}
