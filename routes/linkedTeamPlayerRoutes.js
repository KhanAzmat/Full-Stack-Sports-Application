const express = require('express')
const LinkedTeamPlayer = require('../models/linkedTeamPlayer')
const authController = require("./../controllers/authController");
const linkedTeamPlayerController = require('../controllers/linkedTeamPlayerController')

const router = express.Router()

router.use(authController.protect)

router.route('/').get(linkedTeamPlayerController.getAllLinkedTeamPlayers)
router.route('/').post(linkedTeamPlayerController.createLinkedTeamPlayer)
router.route('/:id')
    .patch(linkedTeamPlayerController.updateLinkedTeamPlayer) 
    .delete(linkedTeamPlayerController.deleteLinkedTeamPlayer)

router.route('/removePlayers/:id').patch(linkedTeamPlayerController.removeAllPlayers)

module.exports = router