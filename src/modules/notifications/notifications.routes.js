const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');

router.get('/', notificationsController.getNotifications);
router.get('/:notificationId', notificationsController.getNotificationById);
router.patch('/:notificationId/read', notificationsController.markNotificationRead);
router.patch('/read-all', notificationsController.markAllNotificationsRead);

module.exports = router;
