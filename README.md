# Sprint

Sprint is a task tracking application for agile development, built with Next.js and Planetscale. It allows for seamless management of software development tasks in a fast-paced Agile environment. With Sprint, teams can create, update, track, and organize tasks more efficiently, leading to improved productivity and project visibility.

## Features

1. **Task Management:** Easily create, update, delete and track tasks.
2. **Agile Oriented:** Supports sprint planning, retrospective, and daily standup meetings.
3. **Project Management:** Manage multiple software development projects.
4. **Collaboration:** Invite team members to projects and assign tasks.
5. **Progress Tracking:** Track the progress of your sprints and individual tasks.
6. **Responsive Design:** Optimized for a variety of screens and devices using Chakra UI and Tailwind CSS for a modern, clean user interface.

## Technology Stack

1. **Frontend:** The frontend is built using Next.js, a React-based framework that offers server-side rendering and generates static websites for React-based web applications. The user interface is crafted with Chakra UI and Tailwind CSS for a clean, modern, and responsive design.

2. **Backend:** The backend is also handled by Next.js, integrated with APIs and serverless functions.

3. **Database:** The app uses PlanetScale, a scalable relational database platform built on MySQL and Vitess. It offers worry-free scaling with strong consistency and high availability.

4. **State Management:** The state management is handled using React Query, an efficient data synchronization library for React, ensuring state management is fast, efficient and less error-prone.

## Setup and Installation

### Pre-requisites

- Node.js (v12 or latest)
- npm or Yarn
- PlanetScale account and setup

### Installation

1. Clone the repository:

```
git clone https://github.com/username/sprint.git
```

2. Change into the project directory:

```
cd sprint
```

3. Install the project dependencies:

```
npm install
# or
yarn install
```

4. Setup your PlanetScale database and get the connection string.

5. Create a `.env.local` file in the root of your project and add the PlanetScale connection string:

```
DATABASE_URL="your-planetscale-connection-string"
```

6. Run the development server:

```
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License.
