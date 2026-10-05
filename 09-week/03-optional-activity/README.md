## Architecture

The Express API provides two endpoints: GET /tareas and POST /tareas.
The GET /tareas endpoint returns the list of tasks in JSON format.
The POST /tareas endpoint receives a task and creates a new one.
The Ionic React application uses fetch to consume both endpoints.
The task list is loaded with GET and new tasks are created with POST.