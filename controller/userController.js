const db = require("../model/db");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "danhnguyen.18102002@gmail.com",
        pass: "glob oigz gbqe ijut"
    }
});

const codes = new Map(); 

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
  const { email, sdt, ten,matkhau } = req.body;
  const { id } = req.params;

  console.log(req.body ,id);
  db.query(
    `UPDATE nguoidung SET Email = '${email}', SDT = '${sdt}', Ten = '${ten}',MatKhau = '${matkhau}',ID_Quyen = 5  
    WHERE ID_NguoiDung = ${id}`,
    (err, result) => {
      if (err) {
        console.log(err)
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
    `DELETE FROM nguoidung WHERE ID_NguoiDung = '${id}'`,
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

    const sendVerification = async (req, res) => {
      const {email}  = req.body;
      console.log(email);
      const verificationCode = crypto.randomBytes(3).toString('hex');
      console.log({verificationCode,email})

      const mailOptions = {
          from: "danhnguyen.18102002@gmail.com",
          to: email,
          subject: 'NHÀ XE TUẤN TRUNG',
          text: `Mã xác thực của bạn là: ${verificationCode}`
      };

      try {
          await transporter.sendMail(mailOptions);
          codes.set(email, {
              code: verificationCode,
              timestamp: Date.now()
          });
          
          res.status(200).json({ success: true });
      } catch (error) {
      res.status(500).json({ message: 'Lỗi gửi email' });
      }
    };

  const verifyCode = async (req,res) => {
    const { email, code } = req.body;
    const storedData = codes.get(email);

    if (!storedData || Date.now() - storedData.timestamp > 300000) { // Hết hạn sau 5 phút
    return res.status(200).json({ message: 'Mã xác thực đã hết hạn' });
    }

    if (storedData.code !== code) {
    return res.status(200).json({ message: 'Mã xác thực không đúng' });
    }
    
    // codes.delete(email);
    res.json({ success: true });
  };

  const addUser = (req, res) => {
    const {email,matkhau, sdt, ten } = req.body;

    console.log(req.body);

    db.query(
      `INSERT INTO nguoidung (Email, SDT, Ten,MatKhau, ID_quyen) VALUES (?,?,?,?, 5)`,
      [email,sdt,ten,matkhau],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        if (result.affectedRows != 0) {
          console.log("success")
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

  const loginUser = (req, res) => {
    const { sdt ,matkhau} = req.body;
    db.query(`SELECT * FROM nguoidung WHERE SDT = ? and MatKhau = ?`,
      [sdt,matkhau],
      (err, result) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      if (result.length === 0) {
        res.status(404).json({ message: "Không tìm thấy tài khoản" });
        return;
      }
      res.status(200).json({
          data: result[0],
          message: "Đăng nhập thành công",
      });
    });
  };

  const getUser = async (req, res) => {
    const {idUser} = req.body;
    try {
      if(!idUser) {
        res.status(404).json({
          message: "Không có id người dùng",
        });
        return;
      }
      
      db.query(`SELECT * from nguoidung where ID_NguoiDung = ?`,[idUser], (err, result) => {
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

  const getAllUser = async (req, res) => {
    try {
      const query = `SELECT n.ID_NguoiDung,n.Email,n.SDT,n.Ten,n.MatKhau,q.ID_Quyen,q.Ten_Quyen
            FROM nguoidung as n
            INNER JOIN quyen as q ON n.ID_Quyen = q.ID_Quyen;`
      db.query(query, (err, result) => {
        if (err) {
          res.status(500).json({ message: err.message });
          return;
        }
        if (result.length > 0) {
          res.status(200).json({
            data: result,
            message: "Lấy danh sách người dùng thành công",
          });
        } else {
          res.status(404).json({
            message: "Không có người dùng nào",
          });
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
    }
  };

module.exports = {
  loginAdmin,
  createUser,
  updateUser,
  deleteUser,
  sendVerification,
  verifyCode,
  addUser,
  loginUser,
  getUser,
  getAllUser
};
