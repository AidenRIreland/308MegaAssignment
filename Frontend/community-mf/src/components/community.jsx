import React, { useState } from "react";

function Community({ posts, helpRequests, onCreatePost, onCreateHelp,onJoinHelp,onMarkResolved, onLogout }) {
  const [createMode, setCreateMode] = useState("post");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("discussion");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    const userId = localStorage.getItem("userId");
    if (createMode === "post") {
      onCreatePost(userId, title, content, category);
      setTitle("");
      setContent("");
    } else {
      onCreateHelp(userId, description, location);
      setDescription("");
      setLocation("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Community Forum</h2>
        <button
          className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Create Content</h3>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setCreateMode("post")}
            className={`px-4 py-2 border rounded transition ${
              createMode === "post" ? "bg-blue-100 border-blue-400" : "bg-white"
            }`}
          >
            Post
          </button>
          <button
            onClick={() => setCreateMode("help")}
            className={`px-4 py-2 border rounded transition ${
              createMode === "help" ? "bg-blue-100 border-blue-400" : "bg-white"
            }`}
          >
            Help Request
          </button>
        </div>

        {createMode === "post" ? (
          <>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded mb-3 h-24 resize-none"
          />
          <select
            className="w-full p-2 border rounded mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="discussion">Discussion</option>
            <option value="news">News</option>
          </select>
        </>
        ) : (
          <>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded mb-3 h-24 resize-none"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
          </>
        )}
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Posts</h3>
        {posts?.map((post) => {
  const date = post.createdAt
  ? new Date(Number(post.createdAt)).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
  : "Unknown Date";
  return (
    <div key={post.id || post._id} className="border p-4 rounded bg-white shadow mb-4">
      <h4 className="text-lg font-bold mb-1">{post.title}</h4>
      <p className="text-sm text-gray-600 mb-2">
        By <span className="font-semibold">{post.author?.username || "Unknown"}</span> •{" "}
        {date} • Category: <span className="italic">{post.category}</span>
      </p>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
})}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Help Requests</h3>
        {helpRequests?.map((req) => {
  const currentUserId = localStorage.getItem("userId");
  const isAuthor = req.author?.id === currentUserId;
  const hasJoined = req.volunteers?.some(v => v.id === currentUserId);
  
  return (
    <div key={req.id} className="border p-4 rounded bg-white shadow mb-4">
      <p><strong>Author:</strong> {req.author?.username}</p>
      <p><strong>Created:</strong> {new Date(Number(req.createdAt)).toLocaleString()}</p>
      <p><strong>Description:</strong> {req.description}</p>
      <p><strong>Location:</strong> {req.location}</p>
      <p><strong>Status:</strong> {req.isResolved ? "Resolved" : "Pending"}</p>
      <p><strong>Volunteers:</strong> {req.volunteers?.length || 0}</p>

      {!req.isResolved && !hasJoined && (
        <button
          onClick={() => onJoinHelp(req.id)}
          className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
        >
          Register to Help
        </button>
      )}
      {req.isResolved && (
        <button disabled className="bg-gray-400 text-white px-4 py-1 rounded mr-2 cursor-not-allowed">
          Request Resolved
        </button>
      )}
      {isAuthor && !req.isResolved && (
        <button
          onClick={() => onMarkResolved(req.id)}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Mark as Resolved
        </button>
      )}
    </div>
  );
})}
      </div>
    </div>
  );
}

export default Community;
