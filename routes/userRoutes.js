const express = require('express');
const { loginAdmin, createUser, updateUser, deleteUser,sendVerification, verifyCode, addUser, loginUser,getUser, getAllUser } = require('../controller/userController');
const { getLocation } = require('../controller/location');
const { addTuyenXe, getAllTuyenXe, deleteTuyenXe, updateTuyenXe,getAllXe ,getAllTinhThanh,addChuyenXe, getChuyenTheoTuyen,getDiaDiem, getAllChuyenXe, getAllVTCho, getAllTaiXe} = require('../controller/tuyenXeController');
const {DatVe,addTicket } = require('../controller/VeController')
const router = express.Router();



router.post('/login', loginAdmin);
router.post('/createUser', createUser);
router.post('/addUser', addUser);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.post('/send-verification',sendVerification);
router.post('/verify-code', verifyCode); 
router.post('/loginUser', loginUser); 
router.post('/getUser', getUser); 
router.get('/getAllUser', getAllUser); 

// Định nghĩa các route khác

// lấy địa điểm
router.get('/location', getLocation);

//tuyến xe
router.post('/tuyenXe', addTuyenXe);
router.get('/AlltuyenXe', getAllTuyenXe);
router.get('/AllTinhThanh', getAllTinhThanh);
router.get('/AllChuyenXe', getAllChuyenXe);
router.get('/AllVTCho', getAllVTCho);
router.post('/DiaDiem', getDiaDiem);
router.delete('/deleteTuyenXe/:id', deleteTuyenXe);
router.put('/updateTuyenXe/:id', updateTuyenXe);

router.post('/DatVe',DatVe);
router.post('/addTicket',addTicket);
router.post('/addChuyenXe',addChuyenXe);
router.post('/getChuyenTheoTuyen',getChuyenTheoTuyen);
router.get('/getAllTaiXe',getAllTaiXe);
router.get('/getAllXe',getAllXe);

  

module.exports = router;
