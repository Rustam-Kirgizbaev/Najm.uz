const { Telegraf, Telegram } = require("telegraf");
require("dotenv").config();
const rp = require("request-promise");
const cheerio = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");
const { days, months, cities, city_codes } = require("./constants/constants");
const cron = require("node-cron");

const { createCanvas, loadImage } = require("canvas");

const bot = new Telegraf(process.env.BOT_TOKEN);
const telegram = new Telegram(process.env.BOT_TOKEN);

const channels = ["@Namangan_test", "@Toshkent_test"];

bot.start(async (ctx) => {
  let message = "await Abdulloh.getPrayerTimes(4, 23);";
  cron.schedule("* * * * * *", function () {
    ctx.reply("running a task every minute");
  });
});

bot.command("fact", async (ctx) => {
  try {
    const result = [];
    let sent = false;
    const data = await Promise.all(
      city_codes.map(async (city) => {
        const base_url = `https://islom.uz/vaqtlar/${city}/4`;

        let data;

        rp(base_url)
          .then(async function (html) {
            //success!
            let $ = cheerio.load(html);
            cheerioTableparser($);
            data = $("table").parsetable(true, true, true);

            let time = {};
            let times;
            let index = city_codes.indexOf(city);

            time.month = months[data[1][0]];
            time.region = cities[index];
            time.data = [];
            console.log(data);

            for (let i = 1; i < data[0].length; i++) {
              times = {
                day: data[1][i],
                hijri_day: data[0][i],
                day_name: days[data[2][i]],
                fajr: data[3][i],
                sunrise: data[4][i],
                dhuhr: data[5][i],
                asr: data[6][i],
                maghrib: data[7][i],
                isha: data[8][i],
              };
              time.data.push(times);
            }

            result.push(time);
          })
          .catch(function (err) {
            // console.log(err);
          });
        // .finally(() => {
        //   if (!sent) {
        //     result.map((times, index) => {
        //       channels.map((channel) => {
        //         if (channel.includes(times.region)) {
        //           times.data.map((prayerTime, index) => {
        //             nodeHtmlToImage({
        //               output: `./images/${times.region}/4_${index + 1}.png`,
        //               html: `<html><body><div>${JSON.stringify(
        //                 prayerTime
        //               )}</div></body></html>`,
        //             });
        //           });
        //         }
        //       });
        //     });
        //     sent = true;
        //   }
        // });
      })
    );

    console.log("data:", data[0]);

    ctx.reply("Generating image, Please wait !!!");
  } catch (error) {
    console.log("error", error);
    ctx.reply("error sending image");
  }
});

bot.command("test", async (ctx) => {
  const image = await loadImage("./controller/frame.jpeg");
  const canvas = createCanvas(360, 360);
  const context = canvas.getContext("2d");

  context.drawImage(image, 0, 0);
  context.font = "16px Impact";
  context.fillText("Awesome:\t\t\t12:12", 80, 180);
  context.fillText("Awesome:\t\t\t12:12", 80, 200);
  context.fillText("Awesome:\t\t\t12:12", 80, 220);
  context.fillText("Awesome:\t\t\t12:12", 80, 240);
  context.fillText("Awesome:\t\t\t12:12", 80, 260);
  context.fillText("Awesome:\t\t\t12:12", 80, 280);

  const buffer = canvas.toBuffer("image/png");

  ctx.replyWithPhoto({ source: buffer, filename: "image.png" });
});

function test() {
  cron.schedule("* * * * *", function () {
    telegram.sendMessage(-1001630086131, "running a task every minute");
  });
}

bot.launch();
