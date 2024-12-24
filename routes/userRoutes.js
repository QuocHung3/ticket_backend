const express = require('express');
const { loginAdmin, createUser, updateUser, deleteUser } = require('../controller/userController');
const { getLocation } = require('../controller/location');
const { addTuyenXe, getAllTuyenXe, deleteTuyenXe, updateTuyenXe ,getAllTinhThanh,getDiaDiem, getAllChuyenXe, getAllVTCho} = require('../controller/tuyenXeController');
const {DatVe } = require('../controller/VeController')
const router = express.Router();

router.post('/login', loginAdmin);
router.post('/createUser', createUser);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
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

module.exports = router;
