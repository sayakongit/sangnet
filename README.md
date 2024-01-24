<p align="center">
    <img src="https://github.com/sayakongit/status-code-sangnet/blob/master/docs/banner.png " alt="sangnet">
</p>

<div align="center">
  <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</div>

# 🚀 Sangnet | Connecting blood, saving life

This repository contains a project that combines Django, Django REST Framework, Next.js to create a web application with a robust backend and a dynamic frontend.

## Project Structure

The project is organized into two main folders:

- `backend`: Contains the Django application responsible for handling API requests and database interactions.
- `frontend`: Contains the React application built using Next.js, providing a modern and efficient development experience for the frontend.

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

## Frontend Next.js 14 ▲

The frontend is built using Next Js. The frontend offers a user-friendly interface to interact with the API provided by the Django backend.

### Setting Up the Frontend 🛠️

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the required Node packages:
   ```bash
    yarn install | npm install ( yarn recommended )
   ```
3. Start the development server:
   ```bash
    yarn dev | npm run dev ( yarn recommended )
   ```
4. Navigate to `http://localhost:3000` to view the frontend.

## Postman API Public Workspace 📚

For detailed information about the available API endpoints and their usage, refer to the [Post API Documentation](https://example.com/api-docs/posts).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://sayakongit.github.io/"><img src="https://avatars.githubusercontent.com/u/83216382?v=4?s=100" width="100px;" alt="Sayak Saha"/><br /><sub><b>Sayak Saha</b></sub></a><br /><a href="https://github.com/sayakongit/sangnet/commits?author=sayakongit" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://riddhick.github.io/Profile/"><img src="https://avatars.githubusercontent.com/u/39643319?v=4?s=100" width="100px;" alt="Riddhick Dalal"/><br /><sub><b>Riddhick Dalal</b></sub></a><br /><a href="https://github.com/sayakongit/sangnet/commits?author=Riddhick" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/shiwangi-kumari-5b0b3b1b7/"><img src="https://avatars.githubusercontent.com/u/77545230?v=4?s=100" width="100px;" alt="Shiwangi Kumari"/><br /><sub><b>Shiwangi Kumari</b></sub></a><br /><a href="#infra-sshiwangi" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://stefananevski.xyz/"><img src="https://avatars.githubusercontent.com/u/105498279?v=4?s=100" width="100px;" alt="Stefan Anevski"/><br /><sub><b>Stefan Anevski</b></sub></a><br /><a href="https://github.com/sayakongit/sangnet/commits?author=anevski-stefan" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Credits 👏

- Django: [https://www.djangoproject.com/](https://www.djangoproject.com/)
- Django REST Framework: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
- NEXT.js: [https://nextjs.org/](https://nextjs.org/)
- Tailwind CSS [https://tailwindcss.com/](https://tailwindcss.com/)
- Shadcn UI: [https://ui.shadcn.com/](https://ui.shadcn.com/)
- Formik: [https://formik.org/](https://formik.org/)
