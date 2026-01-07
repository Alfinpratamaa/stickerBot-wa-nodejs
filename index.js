const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const moment = require("moment-timezone");
const colors = require("colors");
const fs = require("fs");

// Find available Chromium executable
const findChromiumExecutable = () => {
  const possiblePaths = [
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/snap/bin/chromium",
  ];

  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      return path;
    }
  }

  // If none found, return undefined to let Puppeteer use its default
  return undefined;
};

// Find available FFmpeg executable
const findFfmpegExecutable = () => {
  const possiblePaths = [
    "/usr/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
  ];

  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      return path;
    }
  }

  // Default to system PATH
  return "ffmpeg";
};

const chromiumPath = findChromiumExecutable();
const ffmpegPath = findFfmpegExecutable();

// Puppeteer args for headless operation on Ubuntu
const puppeteerArgs = ["--no-sandbox", "--disable-setuid-sandbox"];

const puppeteerConfig = chromiumPath
  ? {
      executablePath: chromiumPath,
      args: puppeteerArgs,
    }
  : { args: puppeteerArgs };

const client = new Client({
  restartOnAuthFail: true,
  ffmpeg: ffmpegPath,
  authStrategy: new LocalAuth({ clientId: "client" }),
  puppeteer: puppeteerConfig,
});
const config = {
  name: "jomokStickerBot",
  author: "alfin",
  prefix: ".",
  timezone: "Asia/Jakarta",
  groups: true,
};

client.on("qr", (qr) => {
  console.log(
    `[${moment().tz(config.timezone).format("HH:mm:ss")}] Scan the QR below : `
  );
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.clear();

  console.log(
    `[${moment().tz(config.timezone).format("HH:mm:ss")}] ${
      config.name
    } is Already!`.green
  );
});
client.on("message", async (message) => {
  const isGroups = message.from.endsWith("@g.us") ? true : false;
  if ((isGroups && config.groups) || !isGroups) {
    const isStickerCommand = message.body.startsWith(`${config.prefix}sticker`);

    const hasMedia = message.hasMedia;
    const hasCaptionStickerCommand =
      message._data.caption === `${config.prefix}sticker`;

    if ((hasMedia || hasCaptionStickerCommand) && !isStickerCommand) {
      return;
    }

    if (isStickerCommand || hasCaptionStickerCommand) {
      if (
        message.type == "image" ||
        message.type == "video" ||
        message.type == "gif" ||
        message._data.caption == `${config.prefix}sticker`
      ) {
        try {
          const media = await message.downloadMedia();
          client.sendMessage(message.from, "*[⏳]* bentar..");
          client
            .sendMessage(message.from, media, {
              sendMediaAsSticker: true,
              stickerName: config.name,
              stickerAuthor: config.author,
            })
            .then(() => {
              client.sendMessage(message.from, "*[✅]* nih stickernya tod!");
            });
        } catch {
          client.sendMessage(message.from, "*[🔴]* error!");
        }
      }
    }
  }
});

client.initialize();
