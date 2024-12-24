const db = require("../model/db");

const addTuyenXe = async (req, res) => {
  try {
    const { diemDi, diemDen, tenTuyenDi, KhoangCach } = req.body;

    // Kiểm tra xem dữ liệu có hợp lệ không
    if (!diemDi || !diemDen || !tenTuyenDi || !KhoangCach) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    // Sử dụng câu lệnh SQL với dấu hỏi thay vì chèn trực tiếp chuỗi
    const query = `
      INSERT INTO TuyenXe (TenTuyenXe, DiemDi, DiemDen, KhoangCach) 
      VALUES (?, ?, ?, ?)
    `;

    // Truyền các giá trị vào câu lệnh
    db.query(query, [tenTuyenDi, diemDi, diemDen, KhoangCach], (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }
      if (result.affectedRows != 0) {
        res.status(200).json({
          data: result,
          message: "Thêm tuyến xe thành công",
        });
        return;
      } else {
        res.status(400).json({
          message: "Không thể thêm tuyến xe",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
  }
};

const getAllTuyenXe = async (req, res) => {
    try {
      const query = "SELECT * FROM TuyenXe";
      db.query(query, (err, result) => {
        if (err) {
          res.status(500).json({ message: err.message });
          return;
        }
        if (result.length > 0) {
          res.status(200).json({
            data: result,
            message: "Lấy danh sách tuyến xe thành công",
          });
        } else {
          res.status(404).json({
            message: "Không có tuyến xe nào",
          });
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
    }
  };

const deleteTuyenXe = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM TuyenXe WHERE ID_TuyenXe = '${id}'`;
    db.query(query, (err, result) => {
        if (err) {
          res.status(500).json({ message: err.message });
          return;
        }
        if (result.affectedRows!= 0) {
          res.status(200).json({
            data: result,
            message: "Xóa tuyến xe thành công",
          });
        } else {
          res.status(404).json({
            message: "Không tìm thấy tuyến xe nào để xóa",
          });
        }
      });
    }
    catch (error) {
      res.status(500).json({ message: 'Đã xảy ra l��i', error: error.message });
    }
}

const updateTuyenXe = async (req, res) => {
    try {
        const { tenTuyenDi, huyenDiemDi, huyenDiemDen, khoangCach } = req.body;
        const { id } = req.params;
        console.log(id);
        console.log(req.body);
        const query = `
        UPDATE TuyenXe 
        SET TenTuyenXe = ?, DiemDi = ?, DiemDen = ?, KhoangCach = ?
        WHERE ID_TuyenXe = ?
        `;
        db.query(query, [tenTuyenDi, huyenDiemDi, huyenDiemDen, khoangCach, id], (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }
        if (result.affectedRows != 0) {
            res.status(200).json({
            data: result,
            message: "Cập nhật tuyến xe thành công",
            });
            return;
        } else {
            res.status(404).json({
            message: "Không tìm thấy tuyến xe",
            });
        }
        });
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
    }
    };
  
    const getAllTinhThanh = async (req, res) => {
      try {
        const query = "SELECT * FROM tinhthanh";
        db.query(query, (err, result) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }
          if (result.length > 0) {
            res.status(200).json({
              data: result,
              message: "Lấy danh sách tỉnh thành thành công",
            });
          } else {
            res.status(404).json({
              message: "Không tỉnh thành nào",
            });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
      }
    };

    const getAllChuyenXe = async (req, res) => {
      try {
        const query = `SELECT c.ID_ChuyenXe, c.GioDi, c.GioDen, MIN(ch.GiaVe) AS GiaVeMin, MAX(ch.GiaVe) AS GiaVeMax, 
       count(ch.trangThaiCho) AS GheConTrong
          FROM chuyenxe c
          INNER JOIN tuyenxe v ON c.ID_TuyenXe = v.ID_TuyenXe
          INNER JOIN loaiXe d ON c.ID_Xe = d.ID_Xe
          INNER JOIN vitricho ch ON d.ID_Xe = ch.ID_Xe
          WHERE v.DiemDi = 'Đà Nẵng'
          GROUP BY c.ID_ChuyenXe`;
        db.query(query, (err, result) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }
          if (result.length > 0) {
            res.status(200).json({
              data: result,
              message: "Lấy danh sách chuyến xe thành công",
            });
          } else {
            res.status(404).json({
              message: "Không có Chuyến xe nào",
            });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
      }
    };

    const getAllVTCho = async (req, res) => {
      try {
        const query = `SELECT vt.trangThaiCho, vt.viTriCho, vt.GiaVe
                      FROM vitricho vt
                      INNER JOIN loaiXe lx ON vt.ID_Xe = lx.ID_Xe
                      INNER JOIN chuyenxe cx ON lx.ID_Xe = cx.ID_Xe
                      WHERE cx.ID_ChuyenXe = 7;`;
        db.query(query, (err, result) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }
          if (result.length > 0) {
            res.status(200).json({
              data: result,
              message: "Lấy danh sách chỗ thành công",
            });
          } else {
            res.status(404).json({
              message: "Không có chỗ nào",
            });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
      }
    };

    const getDiaDiem = async (req, res) => {
      try {
        console.log(req.body.diaDiem)
        const query = `SELECT tinhthanh.ID_TinhThanh,tinhthanh.TenTinhThanh, quanhuyen.ID_QuanHuyen,quanhuyen.TenQuanHuyen
              FROM tinhthanh
              INNER JOIN quanhuyen ON tinhthanh.ID_TinhThanh = quanhuyen.ID_TinhThanh
              where tinhthanh.TenTinhThanh = ?`;
        db.query(query,[req.body.diaDiem] ,(err, result) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }
          if (result.length > 0) {
            res.status(200).json({
              data: result,
              message: "Lấy danh sách chỗ thành công",
            });
          } else {
            res.status(404).json({
              message: "Không có chỗ nào",
            });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
      }
    };
module.exports = {
  addTuyenXe,
  getAllTuyenXe,
  deleteTuyenXe,
  updateTuyenXe,
  getAllTinhThanh,
  getAllChuyenXe,
  getAllVTCho,
  getDiaDiem
};
