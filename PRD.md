Product Requirements Document (PRD)
1. Product Information
Item	Description
Product name	Threadbase
Feature	Create a discussion thread
Document	Product Requirements Document
Status	Learning/demo implementation
Primary users	Visitors using the thread application


2. Product Summary
Threadbase is a lightweight discussion-thread application. Users can view existing threads and submit a new thread containing a title and body. The interface uses TanStack Query to manage server state and automatically refresh the thread list after a successful submission.
3. Problem Statement
When a user submits a new discussion thread, the application must reliably send the data to the backend and show the updated list. A good user experience must also communicate when a request is in progress and when it fails.
4. Product Goals
1. Allow users to create a thread from the frontend.
2. Display existing threads from the backend.
3. Provide visible feedback while a thread is being created.
4. Prevent duplicate submissions while a request is pending.
5. Update the thread list automatically after successful creation.
6. Explain submission errors without crashing the application.
5. User Stories
- As a visitor, I want to see existing threads so that I can read discussions.
- As a visitor, I want to enter a title and body so that I can create a discussion thread.
- As a visitor, I want to see a loading indicator so that I know my submission is being processed.
- As a visitor, I want the submit button disabled during submission so that I do not accidentally send duplicate requests.
- As a visitor, I want to see an error message when submission fails so that I can correct the problem.
- As a visitor, I want the new thread to appear automatically so that I do not need to reload the page.
6. Functional Requirements
ID	Requirement	Priority
FR-01	The application shall retrieve threads using GET /api/threads.	Must
FR-02	The application shall display each thread's title and body.	Must
FR-03	The form shall collect a title and body.	Must
FR-04	The form shall submit the data using POST /api/threads.	Must
FR-05	The backend shall reject a missing or whitespace-only title with HTTP 400.	Must
FR-06	The backend shall return HTTP 201 when a thread is created successfully.	Must
FR-07	The submit button shall be disabled while the create mutation is pending.	Must
FR-08	The button shall display Posting… while the mutation is pending.	Must
FR-09	The application shall invalidate the ["threads"] query after successful creation.	Must
FR-10	The thread list shall refresh without a full page reload.	Must
FR-11	The title and body fields shall be cleared after successful creation.	Must
FR-12	The form shall display an inline error when the mutation fails.	Must


7. Non-Functional Requirements
- Usability: Loading and error feedback must be visible and understandable.
- Performance: The application should update the list through a query refetch rather than a full-page reload.
- Maintainability: API request logic should remain in the service layer rather than being duplicated in components.
- Reliability: The UI must handle successful and unsuccessful HTTP responses.
- Compatibility: The frontend should run in a modern browser that supports the React application.
8. User Workflow
Open Threadbase
      |
      v
View existing threads
      |
      v
Enter title and body
      |
      v
Click "Post thread"
      |
      v
Button changes to "Posting…"
      |
      v
Send POST /api/threads
      |
      +----------------------+
      |                      |
      v                      v
   Success                 Failure
      |                      |
      v                      v
Invalidate query        Show inline error
      |                      |
      v                      v
Refetch thread list     User corrects input
      |
      v
Clear form and show new thread
9. Acceptance Criteria
The feature is accepted when all of the following can be demonstrated:
AC-01: Successful creation
- Given a valid title and body,
- When the user submits the form,
- Then the browser sends POST /api/threads,
- And the server responds with HTTP 201,
- And the created thread appears in the list.
AC-02: Automatic refresh
- Given the thread list is already displayed,
- When a thread is successfully created,
- Then the application invalidates the ["threads"] query,
- And a GET /api/threads request refetches the list,
- And the page does not need to reload.
AC-03: Pending state
- Given a create request is in progress,
- Then the submit button is disabled,
- And its label is Posting…,
- And another submission cannot be triggered through that button.
AC-04: Validation error
- Given the title is empty or contains only whitespace,
- When the user submits the form,
- Then the API responds with HTTP 400,
- And an inline error message is displayed,
- And the application remains usable.
AC-05: Form reset
- Given a thread is successfully created,
- Then both title and body fields are cleared.
AC-06: Initial list loading
- Given the application is retrieving threads,
- Then a loading message is displayed until the request completes.
10. Dependencies
- React and React DOM.
- Vite.
- TanStack Query and React Query Devtools.
- Axios.
- Node.js.
- Express.
- CORS middleware.
11. Assumptions and Constraints
- The backend is available at the URL configured by VITE_API_URL.
- The backend listens on port 3001 in the supplied local setup.
- The frontend runs through Vite.
- The backend currently uses in-memory storage.
- Authentication, authorization, editing, deleting, and database persistence are not part of this feature.
12. Success Metrics
The feature is considered successful when:
- A valid submission produces one successful POST request.
- The thread list refetches after the successful mutation.
- The new thread is visible without a manual page reload.
- The pending state is visible and prevents repeated button submissions.
- An invalid title produces a visible error.
- The form resets after successful creation.
