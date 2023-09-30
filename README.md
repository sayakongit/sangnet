<p align="center">
    <img src="https://github.com/sayakongit/status-code-sangnet/blob/master/docs/banner.png " alt="sangnet">
</p>

# 🚀 Sangnet | Connecting blood, saving life

This repository contains a project that combines Django, Django REST Framework, React, and Vite to create a web application with a robust backend and a dynamic frontend.

## Project Structure

The project is organized into two main folders:

- `backend`: Contains the Django application responsible for handling API requests and database interactions.
- `frontend`: Contains the React application built using Vite, providing a modern and efficient development experience for the frontend.

## Backend (Django) 📦

The backend is built using Django and Django REST Framework, providing a RESTful API to communicate with the frontend. The key features of the backend include:

- API endpoints to manage various resources, such as users, data models, and more.
- Integration with a database (e.g., PostgreSQL, SQLite) to store and retrieve data.
- Authentication and authorization mechanisms to secure API endpoints.
- Custom views, serializers, and models to tailor the API to your project's needs.

### Setting Up the Backend 🛠️

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. **Create a Python Virtual Environment (Optional, but recommended):**

   Create and activate a virtual environment to isolate project dependencies.

   On macOS and Linux:

   ```
   python3 -m venv venv
   source venv/bin/activate
   ```

   On Windows:

   ```
   pip install virtualenv
   virtualenv venv
   ./venv/Scripts/Activate.ps1
   ```

3. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
    python manage.py makemigrations
    python manage.py migrate
   ```
5. Start the Django development server:
   ```bash
    python manage.py runserver
   ```
6. Use `http://localhost:8000` as the API base URL.

## Frontend (React with Vite) ⚛️

The frontend is built using React and Vite, providing fast development and hot module replacement for efficient code changes. The frontend offers a user-friendly interface to interact with the API provided by the Django backend.

### Setting Up the Frontend 🛠️

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the required Node packages:
   ```bash
    npm install
   ```
3. Start the Vite development server:
   ```bash
    npm run dev
   ```
4. Navigate to `http://localhost:5173` to view the frontend.

## Postman API Public Workspace 📚

For detailed information about the available API endpoints and their usage, refer to the [Post API Documentation](https://example.com/api-docs/posts).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Credits 👏

- Django: [https://www.djangoproject.com/](https://www.djangoproject.com/)
- Django REST Framework: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
- React: [https://reactjs.org/](https://reactjs.org/)
- Vite: [https://vitejs.dev/](https://vitejs.dev/)
- Material UI: [https://mui.com/](https://mui.com/)
- Material UI: [https://mui.com/](https://mui.com/)
- Formik: [https://formik.org/](https://formik.org/)
