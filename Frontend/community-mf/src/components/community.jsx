import React, { useState } from "react";

function Community({ posts, helpRequests, onCreatePost, onCreateHelp, onLogout }) {
  const [createMode, setCreateMode] = useState("post");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    const userId = localStorage.getItem("userId");
    if (createMode === "post") {
      onCreatePost(userId, title, content);
      setTitle("");
      setContent("");
    } else {
      onCreateHelp(userId, description, location);
      setDescription("");
      setLocation("");
    }
  };

  return (
    <div>
      <h2>Community Forum</h2>
      <button onClick={onLogout}>Log Out</button>

      <h3>Create Content</h3>
      <button onClick={() => setCreateMode("post")}>Post</button>
      <button onClick={() => setCreateMode("help")}>Help Request</button>

      {createMode === "post" ? (
        <>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        </>
      ) : (
        <>
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </>
      )}
      <button onClick={handleSubmit}>Submit</button>

      <h3>Posts</h3>
      {posts.map((post) => (
        <div key={post.id}>
          <h4>{post.title}</h4>
          <p>{post.content}</p>
        </div>
      ))}

      <h3>Help Requests</h3>
      {helpRequests.map((req) => (
        <div key={req.id}>
          <p>{req.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Community;
