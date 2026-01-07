# Jomok Sticker Bot

## Description
Jomok Sticker Bot is a WhatsApp bot that allows users to create stickers from images, videos, and GIFs effortlessly.

## Key Features
- Create stickers from images, videos, and GIFs.
- Supports both group and private messages.
- User-friendly sticker creation without user intervention.
  
## Prerequisites
Make sure you have the following installed before proceeding:

1. **Node.js** - Download and install from: [Node.js Official Website](https://nodejs.org/)

2. **FFmpeg** - Required for processing media files:
   ```bash
   sudo apt update
   sudo apt install ffmpeg
   ```

3. **Chromium Browser** - Required for WhatsApp Web automation:
   ```bash
   sudo apt update
   sudo apt install chromium-browser
   ```
   
   Alternatively, you can install Google Chrome:
   ```bash
   wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
   sudo apt install ./google-chrome-stable_current_amd64.deb
   ```
   
   **Note**: The bot will automatically detect which browser is installed (Chromium or Chrome) and use the appropriate executable path.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Alfinpratamaa/stickerBot-wa-nodejs.git
   cd stickerBot-wa-nodejs
   ```
2. Install dependencies (skip Puppeteer's Chromium download since we're using system Chromium):
   ```bash
   PUPPETEER_SKIP_DOWNLOAD=true npm i
   ```
   
   **Note**: The `PUPPETEER_SKIP_DOWNLOAD=true` prefix is only needed during the initial `npm install`. You don't need to set it permanently. For subsequent npm installs, you can also add it to your `.npmrc` file:
   ```bash
   echo "PUPPETEER_SKIP_DOWNLOAD=true" >> .npmrc
   ```
3. Run the app:
   ```bash
   npm start
   ```
  
## How to use bot on whatsapp

1. use whatsapp account
2. go to linked devices on the menu
3. scan qr that's showed on terminal
4. great !! sticker bot has activated on your whatsapp account
5. now your friend can use command  <span style='font-weight: 800;'>'.sticker'</span>   on capion of pic
