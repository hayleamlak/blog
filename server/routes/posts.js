import express from "express";
import Post from "../models/Post.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new post
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content, author: req.user.id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ msg: "Error creating post" });
  }
});

// ✅ Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching posts" });
  }
});

// ✅ Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching post" });
  }
});

// ✅ Update post
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ msg: "Error updating post" });
  }
});

// ✅ Delete post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    await post.deleteOne();
    res.json({ msg: "Post deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting post" });
  }
});

export default router;
