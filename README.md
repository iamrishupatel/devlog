![devlog-banner](/public/devlog-banner.png)

# Devlog

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=devlog&style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/iamrishupatel/devlog?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues-raw/iamrishupatel/devlog?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/iamrishupatel/devlog?style=for-the-badge)
![Licence](https://img.shields.io/github/license/iamrishupatel/devlog?style=for-the-badge)
![Lines of code](https://img.shields.io/tokei/lines/github/iamrishupatel/devlog?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/iamrishupatel/devlog?style=for-the-badge)
![Uptime Robot ratio (7 days)](https://img.shields.io/uptimerobot/ratio/7/m791924769-29870badb5a5d78e2bb8136a?style=for-the-badge)
![Twitter](https://img.shields.io/twitter/follow/iamrishupatel?style=for-the-badge)

Devlog is blogging platform for developers built with Next.js and Firebase and is loosely inspired by Dev.to

Sign up for an 👨‍🎤 account, ✍️ write posts, then 💖 heart and ✍ comment on content created by other users. All public content is server-rendered and search-engine optimized.

> visit devlog [here](https://thedevlog.vercel.app) or [here](https://devlog.rlabs.dev)

## Features

- 🔐 Authentication

  - Google OAuth
  - Facebook OAuth
  - Github OAuth

- Blogging

  - ✍ Write your blog
  - 🗞 Update your blog
  - 📖 Read blogs written by othes
  - 💀 Delete your blog

- 💞 Realtime hearts
- 👨‍💻 Realtime comments
- 🔫 Reply on comments
- 📂 Image file uploads
- 📰 Bot-friendly content (SEO)
- 👨‍🎤 Custom Firebase usernames

## Tech stack

- React
- NextJs
- Firebase

## Running Locally

There are some prerequisites to run the app successfully on your local machine, follow the below steps to get started

### Prerequisites

- [Node](https://nodejs.org/en/) `16` or higher
- [npm](https://www.npmjs.com/) `8.5.0` or higher

Run the below commands in your terminal to confirm that all the requirements are passed to run the project Locally

- `node -v`
- `npm -v`

All the above commands should execute successfully and output the version numbers specified

### Project setup

**Clone the project repository**

```
git clone https://github.com/iamrishupatel/devlog.git
```

**Navigate to the project directory**

```
cd devlog
```

**Install Dependencies**

```
npm install
```

#### Firebase Setup

Complete the proces to create a firebase project and register a web app,
and initialize Authentication, Firestore and Storage Services

**_Environment Variables_**

- Create a file name `.env.local` in the root directory of your project
- Browse to your firebase project settings, by clicking on the gear or cog icon in the left sidebar
- In the general setion of project settings, scroll down until you find `firebaseConfig` object with some project credentials
- Now fill your `.env.local` with the values from `firebaseConfig` object in your firebase project settings
- All enviornment Variables in `.env.local` 👇

  - NEXT_PUBLIC_FIRE_API_KEY=<fill_value_from_firebaseConfig>
  - NEXT_PUBLIC_FIRE_AUTH_DOMAIN=<fill_value_from_firebaseConfig>
  - NEXT_PUBLIC_FIRE_PROJECT_ID=<fill_value_from_firebaseConfig>
  - NEXT_PUBLIC_FIRE_SB=<fill_value_from_firebaseConfig>
  - NEXT_PUBLIC_FIRE_MESSAGE_SENDER_ID=<fill_value_from_firebaseConfig>
  - NEXT_PUBLIC_FIRE_APP_ID=<fill_value_from_firebaseConfig>
  - NEXT_PUBLIC_FIRE_MEASUREMENT_ID=<fill_value_from_firebaseConfig>

**_Authentication Setup_**

- To perform authentication via google enable the sign in provider from the Authentication tab of fireabase console.
- You can follow this [guide](https://firebase.google.com/docs/auth/web/facebook-login) for authentication via facebook
- You can follow this [guide](https://firebase.google.com/docs/auth/web/github-auth) for authentication via github

Now that all requirements are in place lets start our servers

Run `npm run dev` to start client on port 3000

🥳 Hurray! you made it, go ahead to localhost:3000 to see the project in action

## License

[MIT](https://choosealicense.com/licenses/mit/)
