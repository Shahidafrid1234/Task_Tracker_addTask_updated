import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { auth } from "./firebase";


const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
);
