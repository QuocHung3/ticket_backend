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


module.exports = {
  DatVe
};
