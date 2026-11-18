Low-Level Design (LLD)
1. Overview
This document describes the implementation-level design of the Threadbase create-thread workflow.
2. Repository Structure
POST-Mutations/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateThreadForm.jsx
│   │   │   └── ThreadList.jsx
│   │   ├── services/
│   │   │   ├── apiClient.js
│   │   │   └── threads.service.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env.development.example
├── server/
│   ├── server.js
│   └── package.json
├── HLD.md
├── LLD.md
├── PRD.md
├── README.md
└── package.json
3. Frontend Design
3.1 main.jsx
- Creates the React application root.
- Instantiates a TanStack Query QueryClient.
- Wraps the application in QueryClientProvider.
- Makes the shared query cache available to components.
- Includes React Query Devtools for development inspection.
3.2 App.jsx
- Renders the application heading and description.
- Renders CreateThreadForm.
- Renders ThreadList.
3.3 CreateThreadForm.jsx
Local state
State	Type	Initial value	Purpose
title	string	""	Stores the thread title
body	string	""	Stores the thread body


React Query dependencies
- useQueryClient() obtains the shared query client.
- useMutation() manages the create request.
- mutationFn is the createThread function reference.
- onSuccess invalidates the thread-list query and resets both fields.
- onError logs the failure for debugging.
- mutation.isPending controls the disabled button and Posting… label.
- mutation.isError controls the inline error message.
Submission algorithm
handleSubmit(event)
    |
    +--> Prevent default form submission
    |
    +--> mutation.mutate({ title, body })
              |
              +--> createThread(newThread)
                        |
                        +--> POST /api/threads
                                  |
                                  +--> Success?
                                  |      |
                                  |      +--> Invalidate ["threads"]
                                  |      +--> Clear title and body
                                  |
                                  +--> Failure?
                                         |
                                         +--> Set mutation error state
                                         +--> Render inline error
3.4 ThreadList.jsx
- Uses useQuery with queryKey: ["threads"].
- Uses getThreads as its query function.
- Shows a loading message while the query is pending.
- Shows an error message if the query fails.
- Renders each thread using its id as the React key.
4. Service Layer
4.1 apiClient.js
- Creates an Axios instance.
- Reads the API base URL from import.meta.env.VITE_API_URL.
- Sets JSON request and response headers.
4.2 threads.service.js
getThreads()
- Sends GET /api/threads.
- Returns response.data.
createThread(newThread)
- Accepts an object containing title and body.
- Sends POST /api/threads with that object.
- Returns response.data.
- Allows Axios errors to propagate to TanStack Query.
5. Backend Design
5.1 Express setup
- Creates an Express application.
- Enables CORS.
- Enables JSON request-body parsing.
- Starts the server on port 3001.
5.2 In-memory data model
A thread has the following shape:
Field	Type	Description
id	number	Unique incrementing identifier
title	string	Required thread title
body	string	Thread content; defaults to an empty string
createdAt	number	Creation timestamp in milliseconds


The current collection is an in-memory array. It is not persistent.
5.3 GET /api/threads
1. Copies the thread array.
2. Sorts the copy by createdAt in descending order.
3. Returns the resulting array as JSON.
4. Does not modify the original array during sorting.
5.4 POST /api/threads
1. Reads title and body from the JSON request body.
2. Defaults body to an empty string.
3. Checks whether the title is missing or contains only whitespace.
4. If invalid, returns HTTP 400 with { "error": "Title is required." }.
5. If valid, trims the title and body.
6. Creates an ID and timestamp.
7. Adds the thread to the in-memory array.
8. Responds after the configured delay with HTTP 201 and the created thread.
6. API Contract
Create thread
Request
- Method: POST
- Path: /api/threads
- Content-Type: application/json
{
  "title": "Example title",
  "body": "Example body"
}
Success: 201 Created
{
  "id": 4,
  "title": "Example title",
  "body": "Example body",
  "createdAt": 1730000000000
}
Validation failure: 400 Bad Request
{
  "error": "Title is required."
}
List threads
Request
- Method: GET
- Path: /api/threads
Success: 200 OK, with a JSON array of thread objects.
7. Query Cache Design
The thread list uses one query key:
["threads"]
The create mutation invalidates the same key after success:
queryClient.invalidateQueries({
  queryKey: ["threads"],
});
This marks matching cached data as stale and causes the active thread-list query to refetch. The UI therefore updates without a browser reload.
8. Error and Loading Behavior
Condition	Expected behavior
Initial list request pending	Display Loading threads…
Initial list request fails	Display the list error
Create request pending	Disable submit button and show Posting…
Create request succeeds	Invalidate list query and clear form
Create request fails	Display inline mutation error
Empty or whitespace-only title	API returns HTTP 400


9. Configuration and Execution
The frontend uses VITE_API_URL as the Axios base URL. Configure it in the local development environment file using the backend origin, for example:
VITE_API_URL=http://localhost:3001
Install dependencies and start both services using the scripts in the root package.json:
npm run setup
npm run dev
10. Implementation Limitations
- Data is lost when the backend process restarts.
- The API has no authentication.
- There is no database transaction or persistence layer.
- Error handling is intentionally limited to the current learning workflow.
- The API has no pagination or rate limiting.
