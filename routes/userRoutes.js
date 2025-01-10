const express = require('express');
const { loginAdmin, createUser, updateUser, deleteUser,sendVerification, verifyCode, addUser, loginUser,getUser, getAllUser, getThongBao } = require('../controller/userController');
const { getLocation } = require('../controller/location');
const { addTuyenXe, getAllTuyenXe,addXe, deleteTuyenXe,deleteXe, getAllVeDatTheoNgay,getAllChoDat,getAllVe, deleteChuyenXe,getAllChuyen,updateTuyenXe,getAllXe ,getAllTinhThanh,addChuyenXe, getChuyenTheoTuyen,getDiaDiem, getAllChuyenXe, getAllVTCho, getAllTaiXe, updateXe, getTongChoDat, getAllVeTheoTuyen, getAllDoanhThuTheoTuyen, getAllChuyenTrongThang} = require('../controller/tuyenXeController');
const {DatVe,addTicket , paymentSheet,cancelTicket, getVeTheoNguoiDung} = require('../controller/VeController')
const router = express.Router();



router.post('/login', loginAdmin);
router.post('/createUser', createUser);
router.post('/addUser', addUser);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.delete('/deleteXe/:id', deleteXe);
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
router.post('/AllChuyenXe', getAllChuyenXe);
router.post('/AllVTCho', getAllVTCho);
router.post('/DiaDiem', getDiaDiem);
router.delete('/deleteTuyenXe/:id', deleteTuyenXe);
router.delete('/deleteChuyenXe/:id', deleteChuyenXe);
router.put('/updateTuyenXe/:id', updateTuyenXe);
router.put('/updateXe/:id', updateXe);

router.post('/DatVe',DatVe);
router.post('/addTicket',addTicket);
router.post('/addChuyenXe',addChuyenXe);
router.post('/addXe',addXe);
router.post('/getChuyenTheoTuyen',getChuyenTheoTuyen);
router.get('/getAllTaiXe',getAllTaiXe);
router.get('/getAllXe',getAllXe);
router.get('/getAllChuyen',getAllChuyen);
router.get('/getAllChoDat',getAllChoDat);
router.get('/getTongChoDat',getTongChoDat);
router.get('/getAllVe',getAllVe);
router.get('/getAllVeTheoTuyen',getAllVeTheoTuyen);
router.get('/getAllDoanhThuTheoTuyen',getAllDoanhThuTheoTuyen);
router.get('/getAllChuyenTrongThang',getAllChuyenTrongThang);
router.get('/getAllVeDatTheoNgay',getAllVeDatTheoNgay);

router.post('/cancelTicket',cancelTicket);
router.post('/getThongBao',getThongBao);
router.post('/getVeTheoNguoiDung',getVeTheoNguoiDung);
router.post('/payment-sheet',paymentSheet);

  

module.exports = router;
