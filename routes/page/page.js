const express = require('express');
const pageController = require('../../controllers/page/page');
const router = express.Router();

router.get('/GioiThieuChung', pageController.GioiThieuChung_get);
router.get('/benhveda', pageController.benhveda_get);
router.get('/benhvaynen', pageController.benhvaynen_get);
router.get('/benhcham', pageController.benhcham_get);
router.get('/viemdacodia', pageController.viemdacodia_get);
router.get('/benhvayneninfor', pageController.benhvayneninfor_get);
router.get('/benhchaminfor', pageController.benhchaminfor_get);
router.get('/viemdacodiainfor', pageController.viemdacodiainfor_get);
router.get('/biquyetdakhoe', pageController.biquyetdakhoe_get);
router.get('/biquyetdakhoeinfor', pageController.biquyetdakhoeinfor_get);
router.get('/khambenhngoaida', pageController.khambenhngoaida_get);
router.get('/khamnamkhoa', pageController.khamnamkhoa_get);
router.get('/khamphukhoa', pageController.khamphukhoa_get);
router.get('/khamvatuvantaohinhthammy', pageController.khamvatuvantaohinhthammy_get);
router.get('/khamthammyda', pageController.khamthammyda_get);
router.get('/adviceMail', pageController.sendAdviceMail_get);
router.post('/adviceMail', pageController.sendAdviceMail_post);
router.get('/login', pageController.login_get);
router.post('/login', pageController.login_post);
router.get('/register', pageController.register_get);
router.post('/register', pageController.register_post);
router.get('/logout', pageController.logout_get);

module.exports=router;
