const taskService = require('../services/task.service');
const responseUtil = require('../../utils/response.util');

class TaskController {
  async getAll(req, res, next) {
    try {
      const { workspaceId, status, assigneeId, page = 1, limit = 10 } = req.query;
      const result = await taskService.getAll({
        workspaceId,
        status,
        assigneeId,
        page: parseInt(page),
        limit: parseInt(limit),
        userId: req.user.id
      });
      res.json(responseUtil.success(result));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.getById(id, req.user.id);
      if (!task) {
        return res.status(404).json(responseUtil.error('Task not found', 404));
      }
      res.json(responseUtil.success(task));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const taskData = { ...req.body, createdBy: req.user.id };
      const task = await taskService.create(taskData);
      res.status(201).json(responseUtil.success(task, 'Task created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const taskData = req.body;
      const task = await taskService.update(id, taskData, req.user.id);
      res.json(responseUtil.success(task, 'Task updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const task = await taskService.updateStatus(id, status, req.user.id);
      res.json(responseUtil.success(task, 'Task status updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await taskService.delete(id, req.user.id);
      res.json(responseUtil.success(null, 'Task deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { content, mentions } = req.body;
      const comment = await taskService.addComment(id, {
        content,
        mentions,
        userId: req.user.id
      });
      res.status(201).json(responseUtil.success(comment, 'Comment added successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getComments(req, res, next) {
    try {
      const { id } = req.params;
      const comments = await taskService.getComments(id);
      res.json(responseUtil.success(comments));
    } catch (error) {
      next(error);
    }
  }

  async addAttachment(req, res, next) {
    try {
      const { id } = req.params;
      const file = req.file;
      const attachment = await taskService.addAttachment(id, file, req.user.id);
      res.status(201).json(responseUtil.success(attachment, 'Attachment added successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAttachments(req, res, next) {
    try {
      const { id } = req.params;
      const attachments = await taskService.getAttachments(id);
      res.json(responseUtil.success(attachments));
    } catch (error) {
      next(error);
    }
  }

  async startTimeTracking(req, res, next) {
    try {
      const { id } = req.params;
      const timeLog = await taskService.startTimeTracking(id, req.user.id);
      res.json(responseUtil.success(timeLog, 'Time tracking started'));
    } catch (error) {
      next(error);
    }
  }

  async stopTimeTracking(req, res, next) {
    try {
      const { id } = req.params;
      const timeLog = await taskService.stopTimeTracking(id, req.user.id);
      res.json(responseUtil.success(timeLog, 'Time tracking stopped'));
    } catch (error) {
      next(error);
    }
  }

  async getTimeLogs(req, res, next) {
    try {
      const { id } = req.params;
      const timeLogs = await taskService.getTimeLogs(id);
      res.json(responseUtil.success(timeLogs));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();


