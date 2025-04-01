import React from "react";

function Community({ posts, helpRequests }) {
  return (
    <div>
      <h2>Community Forum</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>: {post.content}
          </li>
        ))}
      </ul>
      <h3>Help Requests</h3>
      <ul>
        {helpRequests.map((req) => (
          <li key={req.id}>{req.description} - {req.isResolved ? "Resolved" : "Pending"}</li>
        ))}
      </ul>
    </div>
  );
}

export default Community;
