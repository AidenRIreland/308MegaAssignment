import React, { Suspense } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

const Auth = React.lazy(() => import("authMF/Auth"));
const Community = React.lazy(() => import("communityMF/Community"));
const AIChat = React.lazy(() => import("aiMF/AIChat"));

// =============================
// ✅ Auth Mutations
// =============================
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
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

// =============================
// ✅ Community Queries
// =============================
const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      title
      content
      category
      createdAt
    }
  }
`;

const GET_HELP = gql`
  query GetHelpRequests {
    getHelpRequests {
      id
      description
      location
      isResolved
    }
  }
`;

// =============================
// ✅ AI Queries
// =============================
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
  query GetAIInteractions {
    getAIInteractions {
      id
      input
      response
      createdAt
    }
  }
`;

// =============================
// ✅ Apollo Clients
// =============================
const authClient = new ApolloClient({
  uri: "http://localhost:4001/graphql",
  cache: new InMemoryCache(),
});

const communityClient = new ApolloClient({
  uri: "http://localhost:4002/graphql",
  cache: new InMemoryCache(),
});

const aiClient = new ApolloClient({
  uri: "http://localhost:4003/graphql",
  cache: new InMemoryCache(),
});

// =============================
// ✅ Shell App
// =============================
function App() {
  return (
    <div className="container mt-4">
      <h1>COMP308 Mega Assignment</h1>

      <ApolloProvider client={authClient}>
        <Suspense fallback={<p>Loading Auth...</p>}>
          <AuthSection />
        </Suspense>
      </ApolloProvider>

      <ApolloProvider client={communityClient}>
        <Suspense fallback={<p>Loading Community...</p>}>
          <CommunitySection />
        </Suspense>
      </ApolloProvider>

      <ApolloProvider client={aiClient}>
        <Suspense fallback={<p>Loading AI...</p>}>
          <AISection />
        </Suspense>
      </ApolloProvider>
    </div>
  );
}

// =============================
// ✅ Section Components
// =============================
function AuthSection() {
  const [signup] = useMutation(SIGNUP);
  const [login] = useMutation(LOGIN);

  return <Auth onSignup={(data) => signup({ variables: data })} onLogin={(data) => login({ variables: data })} />;
}

function CommunitySection() {
  const { data: postData } = useQuery(GET_POSTS);
  const { data: helpData } = useQuery(GET_HELP);

  return <Community posts={postData?.getPosts || []} helpRequests={helpData?.getHelpRequests || []} />;
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
