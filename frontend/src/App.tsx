import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { RecommendPage } from "./pages/RecommendPage";
import { HistoryPage } from "./pages/HistoryPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-full max-w-full overflow-hidden flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
        <Navbar />
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-slate-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recommend" element={<RecommendPage />} />
            <Route path="/recommend/history" element={<HistoryPage />} />
            <Route path="/recommend/documents" element={<DocumentsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
