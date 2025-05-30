import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';
import FilterBar from './components/FilterBar';
import DataTable from './components/DataTable';
import PdfPreview from './components/PdfPreview';
import RecentlyViewed from './components/RecentlyViewed';
import FileUploadForm from './components/FileUploadForm';
import FolderNavigation from './components/FolderNavigation';
import LoginButton from './components/LoginButton';
import DesignCalculator from './components/DesignCalculator';
import OdooIntegration from './components/OdooIntegration';
import Calculator from './pages/Calculator';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuthCallback from './pages/AuthCallback';
import { DisplayDrawingRecord } from './types';
import { useFilters } from './hooks/useFilters';
import { useSorting } from './hooks/useSorting';
import { usePdfPreview } from './hooks/usePdfPreview';
import { useDropboxAuth } from './hooks/useDropboxAuth';
import { listFiles, listFolders, getFilePreview } from './utils/dropbox';

function App() {
  const { isAuthenticated } = useDropboxAuth();

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard\" replace />} />
      <Route path="/dashboard/*" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/\" replace />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/calculator/*" element={isAuthenticated ? <Calculator /> : <Navigate to="/\" replace />} />
      <Route path="*" element={<Navigate to="/\" replace />} />
    </Routes>
  );
}

export default App;