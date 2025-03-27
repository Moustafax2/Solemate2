# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# SoleMate

SoleMate is a mobile app that lets users identify shoes by taking a picture. The app uses AI to analyze the image and provide details about the shoe's brand, model, price, and more.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   ```
   cp .env.example .env
   ```
   - Add your API keys to the `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running the App

```
npx expo start
```

## API Keys

### Gemini API

This app uses Google's Gemini API for image recognition. To get an API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env` file

**Important:** Never commit your `.env` file with real API keys to version control. The `.env` file is included in `.gitignore` to prevent accidental commits.

## Features

- Take or upload a photo of a shoe
- AI-powered recognition of shoe brand and model
- Display detailed information (brand, model, price, etc.)
- Clean, modern UI

# API Key Management

## For Collaborators

To use the SoleMate app with Gemini API:

1. Obtain the shared API key from the project lead
2. Open `components/shoe/GeminiService.ts`
3. Replace `YOUR_API_KEY_HERE` with the actual API key
4. **IMPORTANT:** Never commit the file with the real API key to GitHub

## For Production

In a production environment, we should:

1. Set up a backend service to handle API calls
2. Store the API key on the server side
3. Make the mobile app call our server instead of directly calling Gemini

This keeps the API key secure and not visible in the client-side code.

## API Key Security

Remember that any API key included directly in a mobile app can potentially be extracted. For a more secure approach:

1. Use a backend service to make API calls
2. Implement rate limiting and request validation
3. Consider using OAuth or API tokens with limited scopes
