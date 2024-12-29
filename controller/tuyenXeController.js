const db = require("../model/db");

const addTuyenXe = async (req, res) => {
  try {
    const { diemDi, diemDen, tenTuyenDi, KhoangCach } = req.body;

    console.log(req.body)

    if (!diemDi || !diemDen || !tenTuyenDi || !KhoangCach) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const query = `
      INSERT INTO TuyenXe (TenTuyenXe, DiemDi, DiemDen, KhoangCach) 
      VALUES (?, ?, ?, ?)
    `;

    // Truyền các giá trị vào câu lệnh
    db.query(query, [tenTuyenDi, diemDi, diemDen, KhoangCach], (err, result) => {
      if (err) {
        console.log(err)
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
        console.log(err)
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
      try{
        if(!req.body) return;

        const query = `SELECT c.ID_ChuyenXe, c.GioDi,d.SoXe, c.GioDen,d.ID_Xe, MIN(ch.GiaVe) AS GiaVeMin, MAX(ch.GiaVe) AS GiaVeMax, 
       count(ch.trangThaiCho) AS GheConTrong
          FROM chuyenxe c
          INNER JOIN tuyenxe v ON c.ID_TuyenXe = v.ID_TuyenXe
          INNER JOIN loaiXe d ON c.ID_Xe = d.ID_Xe
          INNER JOIN vitricho ch ON d.ID_Xe = ch.ID_Xe
          WHERE v.DiemDi = ?
          GROUP BY c.ID_ChuyenXe`;
        db.query(query,[req.body.diemdi], (err, result) => {
          if (err) {
            console.log(err)
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
        if(!req.body.idChuyen){
          console.log("không thấy id chuyến");
          res.status(500).json({ message:"lỗi sảy ra"});
        }
        const query = `SELECT vt.trangThaiCho, vt.viTriCho, vt.GiaVe
                      FROM vitricho vt
                      INNER JOIN loaiXe lx ON vt.ID_Xe = lx.ID_Xe
                      INNER JOIN chuyenxe cx ON lx.ID_Xe = cx.ID_Xe
                      WHERE cx.ID_ChuyenXe = ?;`;
        db.query(query,[req.body.idChuyen], (err, result) => {
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
        console.log(req.body)
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

    const getChuyenTheoTuyen = async (req, res) => {
      try {
        if(!req.body.id) return;

        const query = `SELECT c.ID_ChuyenXe, v.TenTuyenXe, v.DiemDi, c.NgayDi, c.GioDi, 
                  (SELECT COUNT(*) FROM vitricho ch WHERE ch.ID_Xe = c.ID_Xe AND ch.TrangThaiCho = 'còn trống') AS GheConTrong
                  FROM chuyenxe c
                  INNER JOIN tuyenxe v ON c.ID_TuyenXe = v.ID_TuyenXe
                  WHERE v.ID_TuyenXe = ?`;
        db.query(query,[req.body.id] ,(err, result) => {
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

    const getAllTaiXe = async (req, res) => {
      try {
        const query = `select * from taixe`;
        db.query(query, (err, result) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }
          if (result.length > 0) {
            res.status(200).json({
              data: result,
              message: "Lấy danh sách tài xế thành công",
            });
          } else {
            res.status(404).json({
              message: "Không có tài xế nào",
            });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
      }
    };


    const addChuyenXe = async (req, res) => {
      try {
        const { ngaydi, ngayden, giodi, gioden,id_xe,id_tuyenxe,id_taixe } = req.body;
    
      
        if (!ngaydi || !ngayden || !giodi || !gioden || !id_xe || !id_tuyenxe || !id_taixe  ) {
          return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
    
        const query = `
          INSERT INTO chuyenxe (NgayDi, NgayDen, GioDi, GioDen, ID_Xe,ID_TuyenXe,ID_TaiXe) 
          VALUES (?, ?, ?, ?,?,?,?)`;
    
        // Truyền các giá trị vào câu lệnh
        db.query(query, [ngaydi, ngayden, giodi, gioden,id_xe,id_tuyenxe,id_taixe], (err, result) => {
          if (err) {
            console.log(err)
            res.status(500).json({ message: err.message });
            return;
          }
          if (result.affectedRows != 0) {
            res.status(200).json({
              data: result,
              message: "Thêm chuyến xe thành công",
            });
            return;
          } else {
            console.log(err)
            res.status(400).json({
              message: "Không thể thêm chuyến xe",
            });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
      }
    };

    const getAllXe = async (req, res) => {
      try {
        const query = `select * from loaixe`;
        db.query(query, (err, result) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }
          if (result.length > 0) {
            res.status(200).json({
              data: result,
              message: "Lấy danh sách xe thành công",
            });
          } else {
            res.status(404).json({
              message: "Không có xe nào",
            });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
      }
    };

    const deleteChuyenXe = async (req, res) => {
      try {
        const { id } = req.params;
        const query = `DELETE FROM chuyenxe WHERE ID_ChuyenXe = '${id}'`;
        db.query(query, (err, result) => {
            if (err) {
              res.status(500).json({ message: err.message });
              return;
            }
            if (result.affectedRows!= 0) {
              res.status(200).json({
                data: result,
                message: "Xóa chuyến xe thành công",
              });
            } else {
              res.status(404).json({
                message: "Không tìm thấy chuyến xe nào để xóa",
              });
            }
          });
        }
        catch (error) {
          res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
        }
    }

    const getAllChuyen = async (req, res) => {
      try {
        const query = `SELECT * FROM chuyenxe `;
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

    const getAllChoDat = async (req, res) => {
      try {
        const query = `SELECT * FROM vitricho where TrangThaiCho != "còn trống" `;
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

    const getAllVe = async (req, res) => {
      try {
        const query = `SELECT v.*, l.*
              FROM ve v
              INNER JOIN chuyenxe c ON v.ID_ChuyenXe = c.ID_ChuyenXe
              INNER JOIN loaixe l ON c.ID_Xe = l.ID_Xe;`;
        db.query(query, (err, result) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }
          if (result.length > 0) {
            res.status(200).json({
              data: result,
              message: "Lấy danh sách vé thành công",
            });
          } else {
            res.status(404).json({
              message: "Không có vé nào",
            });
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
      }
    };

    const addXe = async (req, res) => {
      try {
        const {soXe,sdt,loaiXe,soCho} = req.body
        
        if(!soXe || !sdt ||!loaiXe ||!soCho) {
          res.status(500).json({ message: "Không có thông tin xe gửi lên" });
          return;
        }
        
        const query = `INSERT INTO loaixe ( SoXe, SDT_Xe, LoaiXe, SoCho)
                        VALUES ( ? , ? , ? , ?);`;
        db.query(query,[soXe,sdt,loaiXe,soCho], (err, result) => {
          if (err) {
            console.log(err)
            res.status(500).json({ message: err.message });
            return;
          }
          if (result.affectedRows > 0) {
            res.status(200).json({
                message: "Thêm xe thành công",
            });
            } else {
                res.status(404).json({
                    message: "Lỗi thêm xe",
            });
        }
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
      }
    };

    const deleteXe = async (req, res) => {
      try {
        const { id } = req.params;
        const query = `DELETE FROM loaixe WHERE ID_Xe = '${id}'`;
        db.query(query, (err, result) => {
            if (err) {
              res.status(500).json({ message: err.message });
              return;
            }
            if (result.affectedRows!= 0) {
              res.status(200).json({
                data: result,
                message: "Xóa xe thành công",
              });
            } else {
              res.status(404).json({
                message: "Không tìm thấy xe nào để xóa",
              });
            }
          });
        }
        catch (error) {
          res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
        }
    }

    const updateXe = async (req, res) => {
      try {
        const { id } = req.params;
        if(!id) {
          res.status(500).json({ message: err.message });
          console.log("không tìm thấy id xe");
          return;
        }
          const { soXe, sdt, loaiXe, soCho } = req.body;
          const query = `
          UPDATE loaixe 
          SET SoXe = ?, SDT_Xe = ?, LoaiXe = ?, SoCho = ?
          WHERE ID_Xe = ?
          `;
          db.query(query, [soXe, sdt, loaiXe, soCho, id], (err, result) => {
          if (err) {
            console.log(err);
              res.status(500).json({ message: err.message });
              return;
          }
          if (result.affectedRows != 0) {
              res.status(200).json({
              data: result,
              message: "Cập nhật xe thành công",
              });
              return;
          } else {
              res.status(404).json({
              message: "Không tìm thấy xe",
              });
          }
          });
      } catch (error) {
        console.log(error)
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
  getDiaDiem,
  getChuyenTheoTuyen,
  getAllTaiXe,
  addChuyenXe,
  getAllXe,
  deleteChuyenXe,
  getAllChuyen,
  getAllChoDat,
  getAllVe,
  addXe,
  deleteXe,
  updateXe
};
