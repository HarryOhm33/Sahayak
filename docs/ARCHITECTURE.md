# System Architecture
## AI-Powered Recommendation Engine for Indian Standards

### 1. High-Level Architecture
The system follows a modern decoupled architecture, optimized for scalability and integration with external procurement portals.

#### 1.1 Frontend (Presentation Layer)
*   **Framework:** React (via Vite)
*   **Styling:** Vanilla CSS (using CSS Variables for Vercel-like aesthetics: Black, White, Grey).
*   **Role:** Provides a minimalist, fast, and responsive user interface for text and file input, and displays the structured AI recommendations.

#### 1.2 Backend (Application Layer)
*   **Framework:** Python (FastAPI / Flask) or Node.js (Express). *For this MVP frontend, the backend will be mocked via service layers.*
*   **Role:** Handles API requests, coordinates with the AI/LLM models, and orchestrates database queries.
*   **File Parsing:** Services for parsing uploaded PDF/DOCX tender documents.

#### 1.3 AI & ML Layer
*   **Semantic Search:** Vector Database (e.g., Pinecone, Milvus, or pgvector) storing embeddings of the entire Indian Standards catalog (titles, scopes, keywords).
*   **Embedding Model:** Local (e.g., MiniLM) or API-based (e.g., OpenAI text-embedding-3) to convert user queries into vectors.
*   **Generative AI (LLM):** LLM (e.g., GPT-4, Claude, or local Llama3) used to:
    *   Synthesize the reasoning ("AI Summary").
    *   Identify allied/normative standards logically.
    *   Determine mandatory certifications based on product categories.

#### 1.4 Data Layer
*   **Relational/Document DB:** Stores the structured metadata of Indian Standards (Standard Number, Year, Title, Revisions, Mandatory Status).
*   **Cache:** Redis (optional) for caching frequent product queries.

### 2. Data Flow
1.  **Client Request:** User submits text or uploads a file on the Frontend.
2.  **API Gateway:** Request is routed to the Backend API.
3.  **Parsing & Preprocessing:** If a file, text is extracted. Text is cleaned and chunked.
4.  **Vector Search:** Text is converted to an embedding. The Vector DB is queried to find the top K closest Indian Standards.
5.  **Context Assembly:** Retrieved standards metadata (titles, scopes, normative refs) is assembled into a prompt.
6.  **LLM Generation:** The prompt is sent to the LLM to generate the final JSON payload containing: Recommended IS codes, Certifications, Allied Standards, and the Explanatory AI Summary.
7.  **Response:** The Backend sends the JSON back to the Frontend.
8.  **Render:** Frontend displays the results in a clean, card-based UI.
