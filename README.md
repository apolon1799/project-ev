# Real-time Collaboration Dashboard

A real-time collaboration dashboard that synchronizes user activity across multiple browser tabs using the `react-broadcast-sync` library. Built with SOLID principles for maintainable, extensible, and testable code.

## Features

### Core Requirements ✅
- **Custom Hook**: `useCollaborativeSession` manages broadcast channel and state
- **User Presence System**: Real-time user detection with join/leave indicators
- **Shared Counter**: Synchronized counter across all tabs with user tracking
- **Real-time Chat**: Live messaging with typing indicators and message expiration
- **Message Management**: Delete own messages and set expiration times
- **TypeScript Support**: Fully typed with proper error handling
- **SOLID Architecture**: Clean, maintainable code following SOLID principles

### Bonus Features 🎉
- **Responsive Design**: Works on desktop and mobile devices
- **User Avatars**: Color-coded user avatars with initials
- **Activity Tracking**: Last activity timestamps and typing indicators
- **Message Expiration**: Set messages to expire after a specified time
- **Clean UI**: Modern, intuitive interface with Tailwind CSS
- **Auto-cleanup**: Automatic cleanup of expired messages and inactive users
- **Service-Oriented Architecture**: Modular services for easy testing and extension

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **react-broadcast-sync** for cross-tab communication
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **SOLID Principles** for clean architecture

## Setup Instructions

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd project-ev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open multiple browser tabs**
   - Navigate to `http://localhost:5173` in multiple tabs
   - Watch real-time synchronization in action!

### Build for Production

```bash
npm run build
```

## GitHub Pages Deployment

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy on every push to main branch

3. **Access Your App**
   - Your app will be available at: `https://apolon1799.github.io/project-ev/`
   - Replace `yourusername` with your GitHub username

### Manual Deployment

If you need to deploy manually:

```bash
npm run build
npx gh-pages -d dist
```

## How to Test

1. **Open Multiple Tabs**: Open the dashboard in 2-3 browser tabs
2. **User Presence**: See users appear/disappear as tabs are opened/closed
3. **Counter Sync**: Update the counter in one tab, watch it sync to others
4. **Real-time Chat**: Send messages and see them appear instantly
5. **Typing Indicators**: Type in the chat to see typing indicators
6. **Message Expiration**: Set short expiry times to test message cleanup
7. **User Activity**: Watch last activity timestamps update

## Implementation Details

### Architecture

The application follows SOLID principles with a service-oriented architecture:

```
src/
├── types/
│   └── interfaces.ts                 # Type definitions and contracts
├── services/
│   ├── UserPresenceService.ts        # User management logic
│   ├── MessageService.ts             # Message handling logic
│   ├── CounterService.ts             # Counter state management
│   └── BroadcastService.ts           # Cross-tab communication
├── handlers/
│   ├── MessageHandler.ts             # Message event processing
│   ├── UserHandler.ts                # User event processing
│   └── CounterHandler.ts             # Counter event processing
├── factories/
│   └── ServiceFactory.ts             # Dependency injection factory
├── hooks/
│   ├── useCollaborativeSession.ts    # Original hook
│   └── useCollaborativeSessionRefactored.ts  # SOLID-based hook
├── utils/
│   ├── timeUtils.ts                  # Time formatting utilities
│   ├── buttonConfigs.ts              # Button configuration data
│   ├── constants.ts                  # CSS class constants
│   └── index.ts                      # Utility exports
├── components/
│   ├── Dashboard.tsx                 # Main dashboard layout
│   ├── UserList.tsx                  # User presence component
│   ├── SharedCounter.tsx             # Synchronized counter
│   └── Chat.tsx                      # Real-time chat
└── App.tsx                          # Root component
```

### Key Components

#### `useCollaborativeSession` Hook
- Manages broadcast channel communication
- Handles user presence, messages, and counter state
- Provides actions for sending messages, updating counter, etc.
- Includes cleanup for expired messages and inactive users

#### User Presence System
- Detects active users across tabs
- Shows user avatars with color coding
- Displays last activity timestamps
- Handles user join/leave events

#### Shared Counter
- Synchronized counter across all tabs
- Tracks who made the last update
- Supports increment/decrement operations
- Shows update timestamps

#### Real-time Chat
- Live message synchronization
- Typing indicators
- Message expiration support
- Delete own messages functionality
- Auto-scroll to latest messages

### Cross-tab Communication

The app uses `react-broadcast-sync` to communicate between tabs:

- **User Events**: `user-join`, `user-leave`, `user-update`
- **Messages**: `message`, `delete-message`
- **Counter**: `counter-update`
- **Typing**: `typing` indicators

### Error Handling

- Proper cleanup on component unmount
- Timeout handling for typing indicators
- Graceful handling of expired messages
- User activity cleanup (5-minute timeout)

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

*Note: BroadcastChannel API is required for cross-tab communication*

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### SOLID Principles Implementation

The codebase follows SOLID principles for maintainable, extensible, and testable code:

#### 1. **Single Responsibility Principle (SRP)**
Each class and function has one clear responsibility:
- `UserPresenceService`: Only handles user presence logic
- `MessageService`: Only handles message operations
- `CounterService`: Only manages counter state
- `BroadcastService`: Only handles cross-tab communication

#### 2. **Open/Closed Principle (OCP)**
Classes are open for extension but closed for modification:
- `IEventHandler` interface allows new event handlers without modifying existing code
- `MessageHandler`, `UserHandler`, `CounterHandler` can be extended with new functionality
- Service interfaces allow different implementations

#### 3. **Liskov Substitution Principle (LSP)**
All implementations can be substituted for their interfaces:
- `UserPresenceService` implements `IUserPresenceService`
- `MessageService` implements `IMessageService`
- All handlers implement their respective interfaces

#### 4. **Interface Segregation Principle (ISP)**
Interfaces are focused and specific:
- `IUserPresenceService` only contains user-related methods
- `IMessageService` only contains message-related methods
- `ICounterService` only contains counter-related methods

#### 5. **Dependency Inversion Principle (DIP)**
High-level modules depend on abstractions, not concretions:
- `ServiceFactory` creates concrete implementations but returns interfaces
- Hook depends on service interfaces, not concrete classes
- Handlers depend on service abstractions

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Components                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Dashboard  │  │  UserList   │  │    Chat     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    Custom Hooks                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            useCollaborativeSession                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    Service Layer                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    User     │  │   Message   │  │   Counter   │            │
│  │  Service    │  │   Service   │  │   Service   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                   Handler Layer                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    User     │  │   Message   │  │   Counter   │            │
│  │   Handler   │  │   Handler   │  │   Handler   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                  Interface Layer                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    IUser    │  │  IMessage   │  │  ICounter   │            │
│  │  Presence   │  │   Service   │  │   Service   │            │
│  │   Service   │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                  Factory Layer                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                ServiceFactory                           │   │
│  │         (Dependency Injection)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Benefits of SOLID Architecture

#### **Maintainability**
- Each service has a single responsibility, making bugs easier to locate and fix
- Changes to one service don't affect others
- Clear separation of concerns

#### **Testability**
- Services can be easily unit tested in isolation
- Mock implementations can be injected for testing
- Each component has clear dependencies

#### **Extensibility**
- New features can be added without modifying existing code
- New handlers can be created for different event types
- Service implementations can be swapped out

#### **Reusability**
- Services can be reused across different components
- Interfaces provide clear contracts for integration
- Factory pattern enables easy service creation

#### **Scalability**
- New services can be added as the application grows
- Handlers can be extended for new message types
- Architecture supports horizontal scaling

### Code Structure

The codebase follows React best practices and SOLID principles:
- **Service-Oriented Architecture**: Modular services for different concerns
- **Dependency Injection**: Factory pattern for service creation
- **Interface-Based Design**: Contracts for all major components
- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Extensible without modification
- Custom hooks for state management
- TypeScript for type safety
- Component composition
- Proper cleanup and error handling
- Responsive design principles

## License

MIT License - feel free to use this project for learning or as a starting point for your own collaboration features!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across multiple tabs
5. Submit a pull request

---
