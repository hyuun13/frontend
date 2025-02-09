// src/App.tsx
import { AuthProvider } from "./context/AuthContext";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import FindId from "./pages/auth/FindId";
import FindPassword from "./pages/auth/FindPassword";
import ChangeMyInfo from "./pages/auth/ChangeMyInfo";
import Home from "./pages/Home"; // 예시 홈 페이지
import SearchResults from "./pages/SearchResults";
import RobotManagement from "./pages/admin/RobotManagement";
import RobotDetails from "./pages/admin/RobotDetails";
import RobotRegistration from "./pages/admin/RobotRegistration";
import CollectionStatus from "./pages/admin/CollectionStatus";
import NotificationPage from "./pages/admin/NotificationPage";
import BookRegistration from "./pages/admin/BookRegistration";
import BookDetails from "./pages/BookDetails";
import Standby from "./pages/admin/RobotHome";
import MyBookShelf from "./pages/MyBookshelf";
import QrcodePage from "./pages/Barcode";
import MyPage from "./pages/MyPage";
import RobotHome from "./pages/admin/RobotHome";
import { NotificationProvider } from "./context/NotificationContext";
import ResponsiveNavigation from "./components/common/NavigationBar";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ResponsiveNavigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find-id" element={<FindId />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/change-my-info" element={<ChangeMyInfo />} />
          <Route path="/admin/robot" element={<RobotManagement />} />
          <Route path="/admin/robot/:id" element={<RobotDetails />} />
          <Route path="/admin/robot/add" element={<RobotRegistration />} />
          <Route path="/admin/collection" element={<CollectionStatus />} />
          <Route path="/admin/notification" element={<NotificationPage />} />
          <Route path="/admin/add" element={<BookRegistration />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/robot" element={<Standby />} />
          <Route path="/bookshelf" element={<MyBookShelf />} />
          <Route path="/qrcode" element={<QrcodePage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/robothome" element={<RobotHome />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
