const Channel = require("../models/channel");
const catchAsync = require("../utils/catch_async");

class ChannelController {
  static getAll = catchAsync(async (req, res, next) => {
    const channels = await Channel.find({ is_deleted: false }).lean();

    res.status(200).json({
      success: true,
      data: channels,
    });
  });

  static get = catchAsync(async (req, res, next) => {
    const channel = await Channel.findOne({
      $or: [{ telegram_id: req.params.id }, { _id: req.params.id }],
    }).lean();

    res.status(200).json({
      success: true,
      data: channel,
    });
  });

  static create = catchAsync(async (req, res, next) => {
    const channel = await Channel.create(req.body);

    res.status(201).json({
      success: true,
      data: channel,
    });
  });

  static update = catchAsync(async (req, res, next) => {
    const channel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: channel,
    });
  });

  static delete = catchAsync(async (req, res, next) => {
    const channel = await Channel.findByIdAndUpdate(
      req.params.id,
      {
        is_deleted: true,
        deleted_at: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: channel,
    });
  });

  static remove = catchAsync(async (req, res, next) => {
    await Channel.findByIdAndDelete(req.params.id);

    res.status(204).json({
      success: true,
    });
  });

  //#region For Internal Usage Only

  static internal_getAll() {
    Channel.find().then((channels) => {
      return channels;
    });
  }

  //#endregion
}

module.exports = ChannelController;
