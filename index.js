const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const moment = require("moment-timezone");
const colors = require("colors");
const puppeteer = require("puppeteer");

async function run() {
  // Launch Puppeteer with specific Chrome path
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Close the browser
  await browser.close();
}

// Run the function

const client = new Client({
  restartOnAuthFail: true,
  ffmpeg: "./ffmpeg.exe",
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
run();
client.initialize();
