const db = require("../model/db");

const DatVe = async (req, res) => {
  try {
    const [trangThaiCho,ID_Cho,ID_Xe,ID_NguoiDung, ID_ChuyenXe, TrangThaiVe, SoGhe,ViTriCho,HinhThuc,Sotien, TrangThaiThanhToan] = req.body; 
    NgayDat = new Date();
    NgayDat.toISOString().slice(0, 19).replace('T', ' ');
    // Đổi trạng thái chỗ
    const queryVTCho = `
        UPDATE vitricho 
        SET TrangThaiCho = ?
        WHERE ID_Cho = ? AND ID_Xe = ?
        `;
    db.query(queryVTCho, [trangThaiCho, ID_Cho, ID_Xe], (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }
        if (result.affectedRows != 0) {
            res.status(200).json({
            data: result,
            message: "Cập nhật trạng thái chỗ thành công",
            });
            return;
        } else {
            res.status(404).json({
            message: "Lỗi cập nhật trạng thái chỗ",
            });
        }
    });

    //Them ve xe
    const queryThemVe = `
      INSERT INTO ve (ID_NguoiDung, ID_ChuyenXe, TrangThaiVe, SoGhe, NgayDat, ${ID_Cho}) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(queryThemVe, [ID_NguoiDung, ID_ChuyenXe, TrangThaiVe, SoGhe, NgayDat, ViTriCho,HinhThuc,Sotien, TrangThaiThanhToan], (err, result) => {
        if (err) {
          res.status(500).json({ message: err.message });
          return;
        }
        if (result.affectedRows != 0) {
          res.status(200).json({
            data: result,
            message: "Thêm vé xe thành công",
          });
          return;
        } else {
          res.status(400).json({
            message: "Không thể thêm vé xe",
          });
        }
    });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
  }

};

const addTicket = async (req, res) => {
  try {
    // 1. Cập nhật trạng thái chỗ
    const updateSeats = async () => {
      const promises = req.body.viTriCho.map((element) => {
        const queryVTCho = `
          UPDATE vitricho 
          SET TrangThaiCho = ?
          WHERE ViTriCho = ? AND ID_Xe = ?
        `;
        return new Promise((resolve, reject) => {
          db.query(queryVTCho, [req.body.trangThaiVe, element, req.body.id_chuyenXe], (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          });
        });
      });

      return Promise.all(promises);
    };

    const seatResults = await updateSeats();
    const failedSeats = seatResults.filter((result) => result.affectedRows === 0);

    if (failedSeats.length > 0) {
      return res.status(404).json({
        message: "Lỗi cập nhật trạng thái chỗ cho một số vị trí",
      });
    }

    // 2. Thêm vé xe
    const queryThemVe = `
      INSERT INTO ve (ID_NguoiDung, ID_ChuyenXe, TrangThaiVe, SoGhe, GioKhoiHanh, ViTriCho, HinhThuc, SoTien, TrangThaiThanhToan, noiDi, noiDen, DiemDon, DiemTra, SDT, GhiChu) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      queryThemVe,
      [
        req.body.id_nguoiDung,
        req.body.id_chuyenXe,
        req.body.trangThaiVe,
        req.body.soGhe.length,
        req.body.gioKH,
        req.body.viTriCho.join(" "),
        req.body.hinhThuc,
        req.body.soTien,
        req.body.trangThaiThanhToan,
        req.body.noiDi,
        req.body.noiDen,
        req.body.diemDon,
        req.body.diemTra,
        req.body.sdt,
        req.body.ghiChu,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: err.message });
        }
        if (result.affectedRows !== 0) {
          return res.status(200).json({
            data: result,
            message: "Thêm vé xe thành công",
          });
        } else {
          return res.status(400).json({
            message: "Không thể thêm vé xe",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
};


module.exports = {
  DatVe,
  addTicket
};
