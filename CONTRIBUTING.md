# Contributing to PopStruct

Thank you for your interest in contributing to PopStruct!

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis
- Docker (optional, recommended)

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up database
export DATABASE_URL="postgresql://user:password@localhost:5432/popstruct"
alembic upgrade head

# Run the server
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Celery Worker
```bash
cd backend
celery -A app.worker.celery worker --loglevel=info
```

## Project Structure

### Backend (`backend/`)
- `app/api/` - API endpoints organized by version
- `app/core/` - Core configuration, security, and dependencies
- `app/models/` - SQLAlchemy database models
- `app/schemas/` - Pydantic validation schemas
- `app/services/` - Business logic for analysis
- `app/utils/` - Helper functions and utilities
- `app/worker/` - Celery tasks for background jobs

### Frontend (`frontend/`)
- `app/` - Next.js 14 app directory with pages
- `components/` - Reusable React components
- `lib/` - Utility functions, API client, and auth

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use Black for formatting (optional)

### TypeScript (Frontend)
- Follow ESLint configuration
- Use TypeScript strict mode
- Use functional components with hooks

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Guidelines
- Include a clear description of the changes
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Follow the code style guidelines

## Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python version, Node version)
- Error messages and stack traces

## Feature Requests

We welcome feature requests! Please:
- Check if the feature has already been requested
- Provide a clear use case
- Describe the expected behavior
- Consider submitting a PR if you can implement it

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Questions?

Feel free to open an issue or discussion for any questions about contributing.

Thank you for contributing to PopStruct!
