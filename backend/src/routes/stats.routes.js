const router = require('express').Router();
const ctrl = require('../controllers/stats.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/admin',     authenticate, authorize('ADMIN'),     ctrl.admin);
router.get('/organizer', authenticate, authorize('ORGANIZER'), ctrl.organizer);

module.exports = router;
