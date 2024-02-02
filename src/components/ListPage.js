import React, { useEffect, useState } from 'react';
import { blue, CustomButton } from './CustomButton';
import { useNavigate } from 'react-router-dom';
import { red } from '@mui/material/colors';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Button } from '@mui/material';
import axios from "axios";

function ListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [email, setEmail] = useState('');

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchPosts();
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate('/')
    } fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/find`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }

  const editPost = (postId) => {
    const postToEdit = posts.find(post => post.id === postId);
    if (postToEdit) {
      navigate(`/post/${postId}`, { state: { post: postToEdit } });
    } else {
      alert("게시물을 찾을 수 없습니다.");
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/delete/${postId}`);
      if (response.data === "ID " + postId + "번 게시물이 삭제되었습니다.") {
        alert('게시글이 삭제되었습니다.');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // const writeBoard = async (postId) => {
  //   if (boardTitle === "" || boardContent === "") {
  //     alert("제목과 내용을 모두 입력해주세요.");
  //     return;
  //   }
  //
  //   const authorEmail = sessionStorage.getItem('email');
  //   console.log('Author Email: ', authorEmail);
  //
  //   // if (!authorEmail) {
  //   //   alert('로그인이 필요합니다.');
  //   //   navigate('/');
  //   //   return;
  //   // }
  //
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/posts/register`, {
  //       title: boardTitle,
  //       content: boardContent,
  //       author: authorEmail,
  //       postId:postId
  //     })
  //         .then(response => {
  //           console.log('Response:', response.data);
  //         })
  //     if (response.data.startsWith("Post ID:")) {
  //       alert('게시글이 작성되었습니다.');
  //       setBoardTitle('');
  //       setBoardContent('');
  //       fetchPosts();
  //     } else {
  //       console.log('Unexpected response', response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error writing post:', error);
  //     alert('게시글 작성에 실패했습니다.');
  //   }
  // }

  const writeBoard = async () => {
    if (boardTitle === "" || boardContent === "") {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const authorEmail = sessionStorage.getItem('email');
    if (!authorEmail) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const postBody = {
        title: boardTitle,
        content: boardContent,
        author: authorEmail
      };

      const response = await axios.post(`${API_BASE_URL}/posts/register`, postBody);

      // Log the response data for debugging
      console.log('Response:', response.data);

      if (response.data && response.data.startsWith("Post ID:")) {
        alert('게시글이 작성되었습니다.');
        setBoardTitle('');
        setBoardContent('');
        fetchPosts();
      } else {
        console.log('Unexpected response', response.data);
      }
    } catch (error) {
      console.error('Error writing post:', error);
      alert('게시글 작성에 실패했습니다.');
    }
  }


  const logoutHandler = async () => {
    try {
      const logoutConfirm = window.confirm('로그아웃 하시겠습니까?');
      if (logoutConfirm) {
        const response = await axios.get(`${API_BASE_URL}/logout`);
        if (response.data.message === "success") {
          console.log("로그아웃 성공");
          sessionStorage.removeItem('email');
          sessionStorage.removeItem('sessionId');
          sessionStorage.removeItem('sessionExpiredTime');
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const searchHandler = async (email) => {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/search?author_email=${email}`);
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  return (
      <div style={{ padding: '40px' }}>
        <h1>게시판 리스트</h1>
        <div>
          <TextField
              id="standard-required"
              label="작성자 이메일 검색"
              variant="standard"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
          />
          <CustomButton
              style={{ backgroundColor: blue[500] }}
              onClick={() => searchHandler(keyword)}>검색</CustomButton>
        </div>

        <TextField
            label="글 제목"
            variant="standard"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            fullWidth
            margin="normal"
        />
        <TextField
            label="글 내용"
            variant="standard"
            value={boardContent}
            onChange={(e) => setBoardContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
        />
        <Button onClick={writeBoard} style={{ margin: '20px 0' }}>저장하기</Button>

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>게시물내용</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>작성일시</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map(post => (
                <TableRow
                    key={post.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {post.title}
                  </TableCell>
                  <TableCell>{post.content}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.created_at}</TableCell>
                  <TableCell>
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      editPost(post.id);
                    }}>수정</Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      deletePost(post.id);
                    }}>삭제</Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <CustomButton style={{ margin: "2rem", backgroundColor: red[500] }} onClick={logoutHandler}>로그아웃</CustomButton>
      </div>
  );
}

export default ListPage;
