import React, { useEffect, useState } from 'react';
import { Card, CardContent, TextField, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostDetailPage = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({
        author: '',
        content: ''
    });

    useEffect(() => {
        const storedPost = localStorage.getItem('post');
        if (storedPost) {
            const postData = JSON.parse(storedPost);
            setPost(postData);
            fetchComments(postData.id);
        }
    }, []);

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/comments?post_id=${postId}`);
            setComments(response.data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handlePostChange = async () => {
        try {
            await axios.put(`http://localhost:8080/api/posts/${post.id}`, post);
            alert('Post updated successfully.');
            navigate('/');
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const submitComment = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/comments`, {
                author: newComment.author,
                content: newComment.content,
                post_id: post.id
            });
            if (response.status === 201) {
                setNewComment({ author: '', content: '' }); // Clear input fields
                fetchComments(post.id); // Refresh comments list
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <h1>게시판 상세</h1>
            <h2>글 제목</h2>
            <TextField
                label="제목"
                variant="outlined"
                value={post.title || ''}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                fullWidth
            />
            <h2>작성자</h2>
            <TextField
                label="작성자"
                variant="outlined"
                value={post.author || ''}
                onChange={(e) => setPost({ ...post, author: e.target.value })}
                fullWidth
            />
            <h2>본문</h2>
            <TextField
                label="본문"
                multiline
                rows={4}
                variant="outlined"
                value={post.content || ''}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                fullWidth
            />
            <div style={{ marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={handlePostChange}>
                    수정
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate('/list')}>
                    취소
                </Button>
            </div>
            <Typography variant="h4" component="h2" style={{ marginTop: '20px' }}>
                댓글
            </Typography>
            {comments.map((comment) => (
                <Card key={comment.id} style={{ marginBottom: '10px' }}>
                    <CardContent>
                        <Typography variant="h6">{comment.author}</Typography>
                        <Typography style={{ marginTop: '10px' }}>{comment.content}</Typography>
                        <Typography color="text.secondary" style={{ marginTop: '5px' }}>
                            {comment.created_at}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
            <Typography variant="h5" component="h3" style={{ marginTop: '20px' }}>
                댓글 작성
            </Typography>
            <Card style={{ marginTop: '10px' }}>
                <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        label="작성자"
                        variant="outlined"
                        value={newComment.author || ''}
                        onChange={(event) => setNewComment(prev => ({ ...prev, author: event.target.value }))}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="댓글 내용"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={newComment.content || ''}
                        onChange={(event) => setNewComment(prev => ({ ...prev, content: event.target.value }))}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '20px' }}
                        onClick={submitComment}
                    >
                        댓글 추가
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostDetailPage;
