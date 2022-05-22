const { Telegram } = require("telegraf");
const rp = require("request-promise");
const cheerio = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");
const { days, months, cities, city_codes } = require("../constants/constants");
const { createCanvas, loadImage } = require("canvas");
const channels = require("../constants/channels");

require("dotenv").config();

const UCELL = "5208341659";
const BEELINE = "786162360";

class TimesController {
  static telegram = new Telegram(process.env.BOT_TOKEN);

  static getTimes(month) {
    try {
      return Promise.all(
        city_codes.map((city) => {
          const base_url = `https://islom.uz/vaqtlar/${city}/${month}`;

          let data;

          return rp(base_url)
            .then(function (html) {
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

              return time;
            })
            .catch((error) => {
              this.telegram.sendMessage(
                UCELL,
                `getTimes() -> rp() -> ${error}`
              );
              this.telegram.sendMessage(
                BEELINE,
                `getTimes() -> rp() -> ${error}`
              );
            });
        })
      );
    } catch (error) {
      this.telegram.sendMessage(UCELL, `getTimes() -> ${error}`);
      this.telegram.sendMessage(BEELINE, `getTimes() -> ${error}`);
    }
  }

  static async sendTimes(day, month) {
    try {
      const image = await loadImage(__dirname + "/image.png");

      this.getTimes(month)
        .then((allData) => {
          allData.map((data) => {
            const neededChannels = channels.filter((channel) =>
              channel.regions.includes(data.region)
            );
            neededChannels.map((channel) => {
              this.telegram
                .sendPhoto(
                  channel.telegram_id,
                  {
                    source: this.bufferBuilder(image, data.data[day - 1]),
                    filename: "image.png",
                  },
                  {
                    caption: `${day} - ${data.month}, ${
                      data.data[day - 1].day_name
                    } kuni uchun namoz vaqtlari!\n#${data.region}\n\n${
                      channel.name
                    }`,
                  }
                )
                .catch((error) => {
                  this.telegram.sendMessage(
                    UCELL,
                    `getTimes() -> ${channel.name} -> ${error}`
                  );
                  this.telegram.sendMessage(
                    BEELINE,
                    `getTimes() -> ${channel.name} -> ${error}`
                  );
                });
            });
          });
        })
        .catch((error) => {
          this.telegram.sendMessage(UCELL, `sendTimes() -> ${error}`);
          this.telegram.sendMessage(BEELINE, `sendTimes() -> ${error}`);
        });
    } catch (error) {
      this.telegram.sendMessage(UCELL, `sendTimes() -> ${error}`);
      this.telegram.sendMessage(BEELINE, `sendTimes() -> ${error}`);
    }
  }

  static bufferBuilder(image, data) {
    const canvas = createCanvas(1200, 1200);
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0);
    context.font = "64px Impact";

    context.fillText(`Bomdod`, 250, 650);
    context.fillText(`Quyosh`, 250, 750);
    context.fillText(`Peshin`, 250, 850);
    context.fillText(`Asr`, 250, 950);
    context.fillText(`Shom`, 250, 1050);
    context.fillText(`Xufton`, 250, 1150);

    context.fillText(`:`, 600, 650);
    context.fillText(`:`, 600, 750);
    context.fillText(`:`, 600, 850);
    context.fillText(`:`, 600, 950);
    context.fillText(`:`, 600, 1050);
    context.fillText(`:`, 600, 1150);

    context.fillText(`${data.fajr}`, 800, 650);
    context.fillText(`${data.sunrise}`, 800, 750);
    context.fillText(`${data.dhuhr}`, 800, 850);
    context.fillText(`${data.asr}`, 800, 950);
    context.fillText(`${data.maghrib}`, 800, 1050);
    context.fillText(`${data.isha}`, 800, 1150);

    return canvas.toBuffer("image/png");
  }
}

module.exports = TimesController;
