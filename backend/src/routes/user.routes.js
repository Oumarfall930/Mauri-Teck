const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { uploadLogo } = require('../middleware/upload.middleware');

router.get('/',                        authenticate, authorize('ADMIN'), ctrl.getAllUsers);
router.post('/organizers',             authenticate, authorize('ADMIN'), uploadLogo, ctrl.createOrganizer);
router.post('/agents',                 authenticate, authorize('ORGANIZER'), ctrl.createAgent);
router.get('/agents',                  authenticate, authorize('ORGANIZER'), ctrl.getMyAgents);
router.patch('/:id/toggle-status',     authenticate, authorize('ADMIN'), ctrl.toggleStatus);
router.put('/me/logo',                 authenticate, authorize('ORGANIZER'), uploadLogo, ctrl.updateLogo);

module.exports = router;
