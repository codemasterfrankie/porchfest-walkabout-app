# Welcome to the Porchfest Walkabout App

This app's job is to augment your [Porchfest](https://www.porchfest.org/) experience [(read more about Porchfest here)](https://en.wikipedia.org/wiki/Porchfest). The app isn't deployed as of October 2026, however version 1 is expected to deploy in December 2026. Here's how version 2 will work: after selecting your town's Porchfest, during the hours of the festival, this app will tell you what band you are nearby. Rather than scrambling to find the schedule online and cross-referencing the porch address, festival-goers now have the freedom to wander where the music takes them and quickly find out what performers they're enjoying. 

This app was created during my senior year in undergrad at Ithaca College under the mentorship of Computer Science professor Doug Turnbull.


## Tools

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). I utilized LLMs to research and select the right framework for this app and landed on Expo because of the simplicity in deploying both to Apple and Android OS.

The development of this app was part mobile development exploration, part local-music passion project, part agentic experimentation. Because my baseline knowledge of mobile development and the tools needed for it were minimal, I utilized LLMs to figure out the folder structure and plugins needed to build this app.

## Downloading the app

Coming soon! The app is not yet deployed to any app stores.

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
