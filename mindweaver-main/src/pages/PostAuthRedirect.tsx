import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PostAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle post-authentication redirect
    const redirectPath = sessionStorage.getItem('postAuthRedirect');
    if (redirectPath) {
      sessionStorage.removeItem('postAuthRedirect');
      navigate(redirectPath);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default PostAuthRedirect;
