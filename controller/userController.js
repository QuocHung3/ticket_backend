const db = require("../model/db");

const loginAdmin = (req, res) => {
  const { sdt } = req.body;
  db.query(`SELECT * FROM nguoidung WHERE sdt = '${sdt}'`, (err, result) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Không tìm thấy admin" });
      return;
    }
    res.status(200).json({
        data: result[0],
        message: "Đăng nhập thành công",
    });
  });
};

const createUser = (req, res) => {
    const { ID_nguoidung, email, sdt, ten, ID_quyen } = req.body;
    db.query(
      `INSERT INTO nguoidung (ID_nguoidung, email, sdt, ten, ID_quyen) VALUES ('${ID_nguoidung}', '${email}', '${sdt}', '${ten}', '${ID_quyen}')`,
      (err, result) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        if (result.affectedRows != 0) {
          res.status(200).json({
            data: result,
            message: "Tạo tài khoản thành công",
          });
          return;
        } else {
          res.status(400).json({
            message: "Không thể tạo tài khoản",
          });
        }
      }
    );
  };
  

const updateUser = (req, res) => {
  const { email, sdt, ten, ID_quyen } = req.body;
  const { id } = req.params;
  console.log(id);
  db.query(
    `UPDATE nguoidung SET email = '${email}', sdt = '${sdt}', ten = '${ten}', ID_quyen = '${ID_quyen}' WHERE ID_nguoidung = '${id}'`,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      if (result.affectedRows != 0) {
        res.status(200).json({
          data: result,
          message: "Cập nhật tài khoản thành công",
        });
        return;
      } else {
        res.status(404).json({
          message: "Không tìm thấy người dùng",
        });
      }
    }
  );
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  db.query(
    `DELETE FROM nguoidung WHERE ID_nguoidung = '${id}'`,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      if (result.affectedRows != 0) {
        res.status(200).json({
          data: result,
          message: "Xóa tài khoản thành công",
        });
        return;
      } else {
        res.status(404).json({
          message: "Không tìm thấy người dùng",
        });
      }
    }
  );
};

module.exports = {
  loginAdmin,
  createUser,
  updateUser,
  deleteUser,
};
