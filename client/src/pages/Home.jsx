import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.error(err.response?.data);
        setError(err.response?.data?.msg || "Failed to load posts");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">All Posts</h1>
      
      {error && <p className="error">{error}</p>}

      {posts.length === 0 && <p className="no-posts">No posts yet. Be the first to create one!</p>}

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">
              {post.content.length > 200
                ? post.content.substring(0, 200) + "..."
                : post.content}
            </p>
            <p className="post-author">By: {post.author.username}</p>
            <Link to={`/posts/${post._id}`} className="read-more">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
