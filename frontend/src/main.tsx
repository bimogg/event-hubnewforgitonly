import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { AppLayout } from "./App";
import "./index.css";
import "./i18n";
import i18n from "./i18n";
import { HomePage } from "./pages/HomePage";
import { EventsPage } from "./pages/EventsPage";
import { TalentsPage } from "./pages/TalentsPage";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EventPage } from "./pages/EventPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { LumierePage } from "./pages/LumierePage";
import { RecruitingPage } from "./pages/RecruitingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminPage } from "./pages/AdminPage";

// Определяем basename для GitHub Pages
const basename = import.meta.env.BASE_URL || '/';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/lumiere" element={<LumierePage />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/new" element={<CreateEventPage />} />
            <Route path="events/:eventId" element={<EventDetailPage />} />
          <Route path="talents" element={<TalentsPage />} />
          <Route path="recruiting" element={<RecruitingPage />} />
          <Route path="admin" element={<AdminPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
