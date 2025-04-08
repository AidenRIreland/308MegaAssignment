import React, { Suspense, useState, useEffect } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

const Auth = React.lazy(() => import("authMF/Auth"));
const Community = React.lazy(() => import("communityMF/Community"));
const AIChat = React.lazy(() => import("aiMF/AIChat"));

// Auth Queries
const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;


// Community
const GET_POSTS = gql`
  query {
    getPosts {
      id
      title
      content
      category
      createdAt
      author {
        username
      }
    }
  }
`;

const GET_HELP = gql`
  query {
    getHelpRequests {
      id
      description
      location
      isResolved
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($author: ID!, $title: String!, $content: String!, $category: String!) {
    createPost(author: $author, title: $title, content: $content, category: $category) {
      id
      title
      content
      category
    }
  }
`;

const CREATE_HELP = gql`
  mutation CreateHelpRequest($author: ID!, $description: String!, $location: String) {
    createHelpRequest(author: $author, description: $description, location: $location) {
      id
      description
      location
      isResolved
    }
  }
`;

// AI
const COMMUNITY_AI_QUERY = gql`query CommunityAI($input: String!) {
  communityAIQuery(input: $input) {
    text
    suggestedQuestions
    retrievedPosts { id title content author }
  }
}`;
const JOIN_HELP_REQUEST = gql`
  mutation JoinHelp($helpRequestId: ID!, $userId: ID!) {
    joinHelpRequest(helpRequestId: $helpRequestId, userId: $userId) {
      id
      volunteers {
        id
        username
      }
    }
  }
`;

const MARK_RESOLVED = gql`
  mutation MarkResolved($helpRequestId: ID!) {
    markHelpRequestResolved(helpRequestId: $helpRequestId) {
      id
      isResolved
    }
  }
`;
const GET_INTERACTIONS = gql`query { getAIInteractions { id input response createdAt } }`;

// ApolloClient factory
const createClient = (port) =>
  new ApolloClient({
    uri: `http://localhost:${port}/graphql`,
    cache: new InMemoryCache(),
    headers: { authorization: localStorage.getItem("token") || "" },
  });

// ========================= Shell App =========================
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
  };

  return (
    <div className="container mt-4">
      <h1>COMP308 Mega Assignment</h1>

      {!isLoggedIn ? (
        <ApolloProvider client={createClient(4001)}>
          <Suspense fallback={<p>Loading Auth...</p>}>
            <AuthSection setIsLoggedIn={setIsLoggedIn} />
          </Suspense>
        </ApolloProvider>
      ) : (
        <>
          <ApolloProvider client={createClient(4002)}>
            <Suspense fallback={<p>Loading Community...</p>}>
              <CommunitySection onLogout={handleLogout} />
            </Suspense>
          </ApolloProvider>

          <ApolloProvider client={createClient(4003)}>
            <Suspense fallback={<p>Loading AI...</p>}>
              <AISection />
            </Suspense>
          </ApolloProvider>
        </>
      )}
    </div>
  );
}

// ================ Section Components ================
function AuthSection({ setIsLoggedIn }) {
  const [signup] = useMutation(SIGNUP);
  const [login] = useMutation(LOGIN);

  const handleSignup = async (data) => {
    const res = await signup({ variables: data });
    const token = res.data.signup.token;
    localStorage.setItem("token", token);
    localStorage.setItem("userId", res.data.signup.user.id);
    setIsLoggedIn(true);
  };

  const handleLogin = async (data) => {
    const res = await login({ variables: { username: data.username, password: data.password } });
    const token = res.data.login.token;
    localStorage.setItem("token", token);
    localStorage.setItem("userId", res.data.login.user.id);
    setIsLoggedIn(true);
  };  

  return <Auth onSignup={handleSignup} onLogin={handleLogin} />;
}

function CommunitySection({ onLogout }) {
  const { data: postData, refetch: refetchPosts } = useQuery(GET_POSTS);
  const { data: helpData, refetch: refetchHelp } = useQuery(GET_HELP);
  const [createPost] = useMutation(CREATE_POST);
  const [createHelp] = useMutation(CREATE_HELP);

  const posts = postData?.getPosts || [];
  const helpRequests = helpData?.getHelpRequests || [];

  const onCreatePost = async (userId, title, content, category) => {
    try {
      await createPost({
        variables: {
          author: userId,
          title,
          content,
          category, //use what's passed from Community.jsx
        },
      });
      refetchPosts();
    } catch (err) {
      console.error("Error creating post:", err.message);
    }
  };

  const onCreateHelp = async (userId, description, location) => {
    try {
      await createHelp({
        variables: {
          author: userId,
          description,
          location,
        },
      });
      refetchHelp();
    } catch (err) {
      console.error("Error creating help request:", err.message);
    }
  };

  return (
    <Community
      posts={posts}
      helpRequests={helpRequests}
      onCreatePost={onCreatePost}
      onCreateHelp={onCreateHelp}
      onLogout={onLogout}
    />
  );
}


function AISection() {
  const [getAIResponse, { data: aiResponse }] = useLazyQuery(COMMUNITY_AI_QUERY);
  const { data: historyData } = useQuery(GET_INTERACTIONS);

  return (
    <AIChat
      onSubmit={(input) => getAIResponse({ variables: { input } })}
      aiResponse={aiResponse?.communityAIQuery}
      history={historyData?.getAIInteractions || []}
    />
  );
}

export default App;