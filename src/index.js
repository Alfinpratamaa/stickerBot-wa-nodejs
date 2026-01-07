const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const moment = require("moment-timezone");
const colors = require("colors");
const ytdl = require("ytdl-core");

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--unhandled-rejections=strict",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  },
  authStrategy: new LocalAuth({ clientId: "client" }),
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
    `[${moment().tz(config.timezone).format("HH:mm:ss")}] Scan the QR below :  `
  );
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.clear();

  console.log(
    `[${moment().tz(config.timezone).format("HH:mm:ss")}] ${
      config.name
    } is Already! `.green
  );
});

client.on("message", async (message) => {
  const isGroups = message.from.endsWith("@g. us") ? true : false;
  if ((isGroups && config.groups) || !isGroups) {
    const isStickerCommand = message.body.startsWith(`${config.prefix}sticker`);
    const isYoutubeCommand = message.body.startsWith(`${config.prefix}youtube`);

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
      } else if (message.body == `${config.prefix}sticker`) {
        const quotedMsg = await message.getQuotedMessage();
        if (message.hasQuotedMsg && quotedMsg.hasMedia) {
          client.sendMessage(message.from, "*[⏳]* bentar..");
          try {
            const media = await quotedMsg.downloadMedia();
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
        } else {
          client.sendMessage(message.from, "*[❎]* Reply Image First!");
        }
      } else if (message.type == "sticker") {
        client.sendMessage(message.from, "*[⏳]* bentar..");
        try {
          const media = await message.downloadMedia();
          client.sendMessage(message.from, media).then(() => {
            client.sendMessage(message.from, "*[✅]* nih stickernya tod!");
          });
        } catch {
          client.sendMessage(message.from, "*[🔴]* error!");
        }
      } else if (message.body == `${config.prefix}image`) {
        const quotedMsg = await message.getQuotedMessage();
        if (message.hasQuotedMsg && quotedMsg.hasMedia) {
          client.sendMessage(message.from, "*[⏳]* bentar..");
          try {
            const media = await quotedMsg.downloadMedia();
            client
              .sendMessage(message.from, media, {
                caption: "nih gambarnya tod!",
                sendMediaAsDocument: true,
              })
              .then(() => {
                client.sendMessage(message.from, "*[✅]* nih gambarnya tod!");
              });
          } catch {
            client.sendMessage(message.from, "*[🔴]* error!");
          }
        } else {
          client.sendMessage(message.from, "*[❎]* Reply Sticker First!");
        }
      }
    } else {
      client.getChatById(message.id.remote).then(async (chat) => {
        await chat.sendSeen();
      });
    }
  }
});

client.initialize();
