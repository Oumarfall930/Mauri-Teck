const router = require('express').Router();
const ctrl = require('../controllers/event.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { uploadEventImage } = require('../middleware/upload.middleware');

// Public
router.get('/',          ctrl.getPublic);
router.get('/:id',       ctrl.getOne);

// Organizer
router.get('/me/list',               authenticate, authorize('ORGANIZER'), ctrl.getMyEvents);
router.post('/',                     authenticate, authorize('ORGANIZER'), uploadEventImage, ctrl.create);
router.put('/:id',                   authenticate, authorize('ORGANIZER'), uploadEventImage, ctrl.update);
router.patch('/:id/publish',         authenticate, authorize('ORGANIZER'), ctrl.publish);
router.post('/assign-agent',         authenticate, authorize('ORGANIZER'), ctrl.assignAgent);
router.post('/remove-agent',         authenticate, authorize('ORGANIZER'), ctrl.removeAgent);
router.post('/:id/ticket-types',     authenticate, authorize('ORGANIZER'), ctrl.addTicketType);
router.put('/:id/ticket-types/:ttId', authenticate, authorize('ORGANIZER'), ctrl.updateTicketType);

// Admin
router.get('/admin/all',             authenticate, authorize('ADMIN'), ctrl.getAll);
router.patch('/admin/:id/status',    authenticate, authorize('ADMIN'), ctrl.adminUpdateStatus);

module.exports = router;
