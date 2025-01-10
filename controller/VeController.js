const db = require("../model/db");
const nodemailer = require('nodemailer');
const stripe = require('stripe')('sk_test_51QcQOUJBpWVJbeYZZAyiOVUXNGrPQPy0nKmmPoov29xeZ7LfszmZr59m9oxM6muXnkhwlY0VyVuXPqO8qTM2c68m00gfhXaqkS');

const codes = new Map(); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "danhnguyen.18102002@gmail.com",
        pass: "glob oigz gbqe ijut"
    }
});


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


const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) {
        console.log(err)
        return reject(err);
      }
      resolve(result);
    });
  });
};

const addTicket = async (req, res) => {

  try {
    // 1. Cập nhật trạng thái chỗ
    const updateSeats = async () => {
      const promises = req.body.viTriCho.map((element) => {
        const queryVTCho = `
          UPDATE vitricho 
          SET TrangThaiCho = ? 
          WHERE ViTriCho = ? AND ID_Xe = ? AND TrangThaiCho != ?
        `;
        return executeQuery(queryVTCho, [
          req.body.trangThaiVe,
          element,
          req.body.id_xe,
          req.body.trangThaiVe,
        ]);
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
      INSERT INTO ve (ID_NguoiDung, ID_ChuyenXe, TrangThaiVe, SoGhe, GioKhoiHanh, ViTriCho, HinhThuc, SoTien, TrangThaiThanhToan, noiDi, noiDen, DiemDon, DiemTra, SDT, GhiChu, code) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(queryThemVe, [
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
      req.body.ghiChu + "\n" + req.body.donTai,
      req.body.code,
    ]);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Không thể thêm vé xe",
      });
    }

    // 3. Gửi email thông tin chuyến xe
    const mailOptions = {
      from: "danhnguyen.18102002@gmail.com",
      to: req.body.email,
      subject: "NHÀ XE TUẤN TRUNG",
      text: !req.body.id_chuyenXeV ? `
        NHÀ XE TUẤN TRUNG

        Thông tin chuyến xe đi của bạn:
        Mã chuyến xe: ${req.body.code}
        Mã số xe: ${req.body.soXe}
        Số ghế: ${req.body.viTriCho}
        Nơi đi: ${req.body.noiDen}
        Nơi đến: ${req.body.noiDi}
        Điểm đón: ${req.body.diemDon}
        Điểm trả: ${req.body.diemTra}
        Số ĐT xe: ${req.body.sdt}
        Thanh toán: ${req.body.trangThaiThanhToan}
        Kiểm tra thông tin đúng trước khi lên xe, chúc quý khách thượng lộ bình an!
      ` 
      :
      `
        NHÀ XE TUẤN TRUNG

        Thông tin chuyến xe đi của bạn:
        Mã chuyến xe: ${req.body.code}
        Mã số xe: ${req.body.soXe}
        Số ghế: ${req.body.viTriCho}
        Nơi đi: ${req.body.noiDen}
        Nơi đến: ${req.body.noiDi}
        Điểm đón: ${req.body.diemDon}
        Điểm trả: ${req.body.diemTra}
        Số ĐT xe: ${req.body.sdt}
        Thanh toán: ${req.body.trangThaiThanhToan}

        Thông tin chuyến xe đi của bạn:
        Mã chuyến xe: ${req.body.code}
        Mã số xe: ${req.body.soXeV}
        Số ghế: ${req.body.soGheV}
        Nơi đi: ${req.body.noiDen}
        Nơi đến: ${req.body.noiDi}
        Điểm đón: ${req.body.diemDonV}
        Điểm trả: ${req.body.diemTraV}
        Số ĐT xe: ${req.body.sdt}
        Thanh toán: ${req.body.trangThaiThanhToan}

        Kiểm tra thông tin đúng trước khi lên xe, chúc quý khách thượng lộ bình an!
      ` 
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Lỗi gửi email", error: err.message });
    }

    // 4. Lưu mã code vào bộ nhớ cache (tùy chọn)
    codes.set(req.body.email, {
      code: req.body.code,
      timestamp: Date.now(),
    });

    if(!req.body.id_chuyenXeV) {
      return res.status(200).json({
        message: "Thêm vé xe thành công và email đã được gửi",
        data: result,
      });
    }

    const updateSeatsV = async () => {
      const promises = req.body.viTriChoV.map((element) => {
        const queryVTCho = `
          UPDATE vitricho 
          SET TrangThaiCho = ? 
          WHERE ViTriCho = ? AND ID_Xe = ? AND TrangThaiCho != ?
        `;
        return executeQuery(queryVTCho, [
          req.body.trangThaiVe,
          element,
          req.body.id_xeV,
          req.body.trangThaiVe,
        ]);
      });
      return Promise.all(promises);
    };

    const seatResultsV = await updateSeatsV();
    const failedSeatsV = seatResultsV.filter((result) => result.affectedRows === 0);

    if (failedSeatsV.length > 0) {
      return res.status(404).json({
        message: "Lỗi cập nhật trạng thái chỗ cho một số vị trí",
      });
    }

    const result1 = await executeQuery(queryThemVe, [
      req.body.id_nguoiDung,
      req.body.id_chuyenXeV,
      req.body.trangThaiVe,
      req.body.soGheV.length,
      req.body.gioKHV,
      req.body.viTriChoV.join(" "),
      req.body.hinhThuc,
      req.body.soTienV,
      req.body.trangThaiThanhToan,
      req.body.noiDen,
      req.body.noiDi,
      req.body.diemDonV,
      req.body.diemTraV,
      req.body.sdt,
      req.body.ghiChu + "\n" + req.body.donTai,
      req.body.code,
    ]);

    if (result1.affectedRows === 0) {
      return res.status(400).json({
        message: "Không thể thêm vé xe",
      });
    }

    // 5. Trả kết quả thành công
    return res.status(200).json({
      message: "Thêm vé xe thành công và email đã được gửi",
      data: result,
    });
  } catch (err) {
    console.error("Error in addTicket:", err);
    return res.status(500).json({ message: "Đã xảy ra lỗi", error: err.message });
  }
};

const cancelTicket = async (req, res) => {
  console.log(req.body)
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

    
    const queryThemVe = `
      UPDATE ve set TrangThaiVe = ? where ID_Ve = ?
    `;

    db.query(
      queryThemVe,
      [ req.body.trangThaiVe,req.body.ID_Ve],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: err.message });
        }
        if (result.affectedRows !== 0) {
          return res.status(200).json({
            data: result,
            message: "huỷ vé xe thành công",
          });
        } else {
          return res.status(400).json({
            message: "Không thể huỷ vé xe",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
};

const getVeTheoNguoiDung = async (req, res) => {
  console.log(req.body)
  try {
    const query = `SELECT *
          FROM ve where ID_NguoiDung = ?`
    db.query(query,[req.body.id], (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
        return;
      }
      if (result.length > 0) {
        res.status(200).json({
          data: result,
          message: "Lấy danh sách vé thành công",
        });
      } else {
        console.log(err)
        res.status(404).json({
          message: "Không có vé nào",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
  }
};

const paymentSheet = async (req, res) => {
  const { giaVe } = req.body
  try {
    const customer = await stripe.customers.create();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: giaVe && giaVe >= 500000 ? giaVe : 500000, // Số tiền (2000 = $20.00)
      currency: 'vnd',
      customer: customer.id,
      payment_method_types: ['card'], // Chỉ dùng thẻ
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Lỗi thanh toán:', error);
    res.status(500).send({ error: "Lỗi thanh toán!" });
  }
}

module.exports = {
  DatVe,
  addTicket,
  cancelTicket,
  getVeTheoNguoiDung,
  paymentSheet
};
