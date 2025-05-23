# Music Application

A modern web application for managing and exploring music groups, albums, and artists.

## Features

- Browse and search music groups
- View detailed information about music groups, including their albums and artists
- Paginated listings for better performance
- Responsive design for all devices

## Project Structure

The application is organized into several key components:

- `App/assets/js/music-service.js`: Core service for handling all music-related API calls
- `App/assets/js/views/`: Contains different view components
  - `music-group-list.js`: Displays list of music groups
  - `music-group-detail.js`: Shows detailed information about a specific music group
  - `album-list.js`: Manages album listings
  - `artist-list.js`: Handles artist listings
- `App/assets/css/`: Contains all styling files
  - `main.css`: Main stylesheet
  - `music-group-list.css`: Specific styles for music group list
  - `music-group-detail.css`: Styles for music group detail view
  - `album-list.css`: Styles for album listings
  - `artist-list.css`: Styles for artist listings

## API Integration

The application integrates with a RESTful API that provides the following endpoints:

- Music Groups:
  - GET `/MusicGroup/Read` - List music groups
  - GET `/MusicGroup/ReadOne` - Get specific music group details
- Albums:
  - GET `/Album/Read` - List albums
  - GET `/Album/ReadOne` - Get specific album details
- Artists:
  - GET `/Artist/Read` - List artists
  - GET `/Artist/ReadOne` - Get specific artist details

## Getting Started

1. Clone the repository
2. Install dependencies
3. Configure the API base URL in your environment
4. Run the application

## Development

The project uses modern JavaScript features and follows a modular architecture. The `MusicService` class handles all API communications and data management.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
