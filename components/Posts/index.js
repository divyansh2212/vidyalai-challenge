import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { useWindowWidth } from '../../WindowWidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

const NoMorePostsMessage = styled.div(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
  fontSize: 18,
  color: '#333',
  fontWeight: 'bold',
  textAlign: 'center',
}));

export default function Posts() {
  const { isSmallerDevice } = useWindowWidth();
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [postsPerPage, setPostsPerPage] = useState(1);
  const [users, setUsers] = useState([])

  const getPostsPerPage = () => {
    return isSmallerDevice ? 1 : 4;
  };

  useEffect(() => {
    setPostsPerPage(getPostsPerPage());
  }, [isSmallerDevice]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: users } = await axios.get('/api/v1/users');
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/v1/posts', {
          params: { start: page * postsPerPage, limit: postsPerPage },
        });

        if (data.length < postsPerPage || data.length === displayedPosts.length) {
          setHasMorePosts(false);
        }

        setPosts((prevPosts) => {
          const uniquePosts = data.filter(post => !prevPosts.some(p => p.id === post.id));
          return [...prevPosts, ...uniquePosts];
        });

        setDisplayedPosts((prevPosts) => {
          const newPosts = data.filter(post => !prevPosts.some(p => p.id === post.id));
          return [...prevPosts, ...newPosts];
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const handleClick = () => {
    if (hasMorePosts) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    setDisplayedPosts(posts.slice(0, (page + 1) * postsPerPage));
  }, [posts, page]);

  return (
    <Container>
      <PostListContainer>
        {displayedPosts.map((post, postIndex) => (
          <Post key={post.id} post={post} user={users[postIndex]} />
        ))}
      </PostListContainer>

      {hasMorePosts ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      ):(
        <NoMorePostsMessage>
          You are all caught up!!!
        </NoMorePostsMessage>
      )}
    </Container>
  );
}
