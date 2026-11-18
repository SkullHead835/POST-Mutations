High-Level Design (HLD)
1. Project Overview
Project: Threadbase – Create Thread using React Query Mutation

Threadbase is a small web application that allows users to view existing discussion threads and submit new threads. The frontend is built with React and Vite. The backend is an Express.js API. TanStack Query manages server-state fetching, mutation status, and cache invalidation.
2. Purpose and Scope
The purpose of this project is to demonstrate a complete create-thread workflow using a React Query mutation.
In scope
- Display the list of existing threads.
- Submit a new thread with a title and body.
- Validate that a title is provided on the server.
- Show a pending state while the POST request is running.
- Prevent repeated submissions while a request is pending.
- Display an inline error when the request fails.
- Refresh the thread list after a successful creation without a page reload.
Out of scope
- User registration and authentication.
- Editing or deleting threads.
- Comments, likes, and notifications.
- Persistent database storage. The current Express server stores threads in an in-memory array, so data resets when the server restarts.
- Production deployment and production-grade security.
3. System Architecture
The application follows a client-server architecture.
+---------------------------+
|        User / Browser     |
+-------------+-------------+
              |
              v
+---------------------------+
|       React Frontend      |
|                           |
|  App.jsx                  |
|   |                       |
|   +--> CreateThreadForm   |
|   |       |               |
|   |       +--> useMutation|
|   |                       |
|   +--> ThreadList         |
|           |               |
|           +--> useQuery   |
+-------------+-------------+
              |
              v
+---------------------------+
|   Axios API Client        |
|   apiClient.js            |
+-------------+-------------+
              |
          HTTP / JSON
              |
              v
+---------------------------+
|       Express API         |
|       server.js           |
|                           |
| GET  /api/threads         |
| POST /api/threads         |
+-------------+-------------+
              |
              v
+---------------------------+
| In-memory threads array   |
+---------------------------+
4. Technology Stack
Layer	Technology	Responsibility
Frontend	React 18	User interface and component rendering
Build/dev server	Vite	Frontend development and production build
Server-state management	TanStack Query v5	Queries, mutations, pending/error states, cache invalidation
HTTP client	Axios	HTTP requests to the backend
Backend	Node.js and Express 4	REST API and request handling
Middleware	CORS and Express JSON parser	Cross-origin requests and JSON body parsing


5. Main Components
Frontend
- App.jsx: Composes the create form and thread list.
- CreateThreadForm.jsx: Collects the title and body and submits them through useMutation.
- ThreadList.jsx: Retrieves and displays threads using useQuery.
- threads.service.js: Contains the getThreads and createThread API functions.
- apiClient.js: Configures the Axios instance.
- main.jsx: Creates the React root and provides the shared QueryClient through QueryClientProvider.
Backend
- server/server.js: Configures Express, CORS, JSON parsing, the thread collection, and the GET/POST endpoints.
6. Main Data Flow
Read threads
1. The application renders ThreadList.
2. useQuery runs with the query key ["threads"].
3. getThreads sends GET /api/threads.
4. The API returns the thread array.
5. React Query caches the response and the component renders the list.
Create a thread
1. The user enters a title and body.
2. The form prevents the browser's default submission.
3. mutation.mutate({ title, body }) invokes createThread.
4. Axios sends POST /api/threads with a JSON request body.
5. The backend validates the title and creates the thread.
6. On success, the frontend invalidates ["threads"].
7. React Query refetches the active thread-list query.
8. The form is cleared and the new thread appears in the list.
Handle an error
1. The backend returns an error response, such as HTTP 400 when the title is empty.
2. The mutation enters its error state.
3. The form displays an inline error message.
4. The form values remain available for correction.
7. API Overview
Method	Endpoint	Purpose	Success response
GET	/api/threads	Retrieve all threads, newest first	200 OK with JSON array
POST	/api/threads	Create a thread	201 Created with created thread


POST request example:
{
  "title": "My First Thread",
  "body": "This is the thread body."
}
Successful response example:
{
  "id": 4,
  "title": "My First Thread",
  "body": "This is the thread body.",
  "createdAt": 1730000000000
}
The timestamp above is illustrative; the server generates the actual value.
8. Quality Attributes
- Usability: Pending and error states communicate the result of submission.
- Responsiveness: The UI updates through React Query without a full page reload.
- Maintainability: API calls are separated from UI components.
- Reliability: Failed requests are represented by mutation error state.
- Simplicity: The project uses a small REST API and a focused component structure.
9. Constraints and Assumptions
- The backend listens on port 3001.
- The Vite frontend normally runs on port 5173.
- The frontend API base URL is supplied through VITE_API_URL.
- The current backend stores data in memory and is intended as a learning/demo application.
- No authentication or authorization is implemented.
10. Future Enhancements
- Replace in-memory storage with a database.
- Add authentication and authorization.
- Add update and delete operations.
- Add automated frontend and backend tests.
- Add pagination and filtering for larger thread collections.
- Add request validation and centralized error handling.
