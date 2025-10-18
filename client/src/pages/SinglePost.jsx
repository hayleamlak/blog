import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6 whitespace-pre-wrap">{post.content}</p>
      <div className="text-sm text-gray-500">
        Category: {post.category || "N/A"} <br />
        Tags: {post.tags?.join(", ") || "None"}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Author: {post.author?.username || "Unknown"} •{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default SinglePost;
