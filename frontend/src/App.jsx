import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import PageGuard from "./Guard/PageGuard";
import AppliedGigs from "./pages/AppliedGigs";
import PostedGigs from "./pages/PostedGigs";
import GigDetails from "./pages/GigDetails";
import Signup from "./pages/Signup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>

        {/* <PageGuard>
            </PageGuard> */}
        <Route
          path="/"
          element={
            <PageGuard>
              <HomePage />
            </PageGuard>
          }
        ></Route>

        <Route
          path="/applied-gigs"
          element={
            <PageGuard>
              <AppliedGigs />
            </PageGuard>
          }
        ></Route>

        <Route
          path="/posted-gigs"
          element={
            <PageGuard>
              <PostedGigs />
            </PageGuard>
          }
        ></Route>

        <Route
          path="/gig/:id"
          element={
            <PageGuard>
              <GigDetails />
            </PageGuard>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
