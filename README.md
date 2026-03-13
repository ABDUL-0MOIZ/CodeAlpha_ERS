# CodeAlpha ERS Backend

Express + MongoDB backend for an Event Registration System.

## Setup

1. Create environment file:
   - Copy `.env.example` to `.env`
   - Update `MONGO_URI` with your MongoDB connection string

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run server:

   ```bash
   npm run dev
   ```

Base URL: `http://localhost:5000`

## API Endpoints

### Users

- `POST /api/users` — create user
- `GET /api/users/:userId` — get user details
- `GET /api/users/:userId/registrations` — view a user's registrations

### Events

- `POST /api/events` — create event
- `GET /api/events` — list all events
- `GET /api/events/:id` — get event details

### Registrations

- `POST /api/registrations` — register user for event
  - body: `{ "userId": "...", "eventId": "..." }`
- `DELETE /api/registrations/:id?userId=<USER_ID>` — cancel registration

### Health

- `GET /api/health`

## Notes

- Registration is linked to both `User` and `Event` models.
- A user can register only once per event.
- Event capacity is enforced for active registrations.
- Optional organizer/admin authentication is not implemented in this baseline version.
