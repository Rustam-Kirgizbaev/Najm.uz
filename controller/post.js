const Post = require("../models/post");
const catchAsync = require("../utils/catch_async");

class PostController {
  static getAll = catchAsync(async (req, res, next) => {
    const posts = await Post.find({ is_deleted: false }).lean();

    res.status(200).json({
      success: true,
      data: posts,
    });
  });

  static get = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id).lean();

    res.status(200).json({
      success: true,
      data: post,
    });
  });

  static create = catchAsync(async (req, res, next) => {
    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post,
    });
  });

  static update = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: post,
    });
  });

  static delete = catchAsync(async (req, res, next) => {
    await Post.findByIdAndDelete(req.params.id);

    res.status(204).json({
      success: true,
    });
  });
}

module.exports = PostController;
