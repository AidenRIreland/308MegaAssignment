import React, { Suspense, useState, useEffect } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
  useMutation,
  gql,
} from "@apollo/client";

const Auth = React.lazy(() => import("authMF/Auth"));
const Community = React.lazy(() => import("communityMF/Community"));
const AIChat = React.lazy(() => import("aiMF/AIChat"));

// =============================
// ✅ GraphQL Definitions
// =============================

// Auth
const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
      }
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

// Community
const GET_POSTS = gql`
  query {
    getAllPosts {
      id
      title
      content
      category
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
    }
  }
`;

const CREATE_HELP = gql`
  mutation CreateHelpRequest($author: ID!, $description: String!, $location: String) {
    createHelpRequest(author: $author, description: $description, location: $location) {
      id
    }
  }
`;

// AI
const COMMUNITY_AI_QUERY = gql`
  query CommunityAI($input: String!) {
    communityAIQuery(input: $input) {
      text
      suggestedQuestions
      retrievedPosts {
        id
        title
        content
        author
      }
    }
  }
`;

const GET_INTERACTIONS = gql`
  query {
    getAIInteractions {
      id
      input
      response
      createdAt
    }
  }
`;

// =============================
// ✅ Apollo Clients per service
// =============================
const createClient = (port) =>
  new ApolloClient({
    uri: `http://localhost:${port}/graphql`,
    cache: new InMemoryCache(),
    headers: {
      authorization: localStorage.getItem("token") || "",
    },
  });

// =============================
// ✅ Shell App
// =============================
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
    <div>
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

// =============================
// ✅ Section Components
// =============================
function AuthSection({ setIsLoggedIn }) {
  const [signup] = useMutation(SIGNUP);
  const [login] = useMutation(LOGIN);

  const handleSignup = async (data) => {
    const res = await signup({ variables: data });
    localStorage.setItem("token", res.data.signup.token);
    localStorage.setItem("userId", res.data.signup.user.id);
    setIsLoggedIn(true);
  };

  const handleLogin = async (data) => {
    const res = await login({ variables: { email: data.email, password: data.password } });
    localStorage.setItem("token", res.data.login.token);
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

  const handleCreatePost = async (author, title, content) => {
    await createPost({ variables: { author, title, content, category: "discussion" } });
    refetchPosts();
  };

  const handleCreateHelp = async (author, description, location) => {
    await createHelp({ variables: { author, description, location } });
    refetchHelp();
  };

  return (
    <Community
      posts={postData?.getAllPosts || []}
      helpRequests={helpData?.getHelpRequests || []}
      onCreatePost={handleCreatePost}
      onCreateHelp={handleCreateHelp}
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
