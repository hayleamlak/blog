import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePost.css"; // We'll create this CSS

function CreatePost() {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Post created:", res.data);
      navigate("/"); // Redirect to homepage after creating
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.msg || "Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <h2>Create a New Post</h2>
        {error && <p className="error-msg">{error}</p>}
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Post Content"
          value={formData.content}
          onChange={handleChange}
          rows="8"
          required
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
