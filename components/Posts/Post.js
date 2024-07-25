import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative',
  scrollSnapType: 'x mandatory',
  scrollBehavior: 'smooth',
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
  scrollSnapAlign: 'center',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const ProfilePicture = styled.div(({ color }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: `${color}`,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  marginRight: '10px',
}));

const UserInfo = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  borderBottom: '1px solid #ccc',
}));

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Post = ({ post, user }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleNextClick = () => {
    setImageIndex((imageIndex + 1 + post?.images.length) % post?.images.length)
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 50,
        behavior: 'smooth',
      });
    }
  };
  
  const userInitials = user ? `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}` : '';
  const handlePrevClick = () => {
    setImageIndex((imageIndex - 1 + post?.images.length) % post?.images.length)
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -70,
        behavior: 'smooth',
      });
    }
  };

  return (
    <PostContainer>
      {user !== null && (
        <UserInfo>
          <ProfilePicture userName={user?.name} color={getRandomColor()}>{userInitials}</ProfilePicture>
          <div>
            <h3>{user?.name}</h3>
            <div>{user?.email}</div>
          </div>
        </UserInfo>
      )} 
      <CarouselContainer>
        <Carousel ref={carouselRef}>
        <CarouselItem key={imageIndex} style={{ height: '300px', overflow: 'hidden' }}>
          <Image src={post?.images[imageIndex]?.url} alt={post.title} />
        </CarouselItem>
        </Carousel>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    content: PropTypes.any,
    images: PropTypes.shape({
      map: PropTypes.func,
    }),
    title: PropTypes.any,
  }),
};

export default Post;
