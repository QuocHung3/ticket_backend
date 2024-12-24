const db = require("../model/db");

const getLocation = (req, res) => {
  db.query(
    `SELECT 
    TinhThanh.ID_TinhThanh AS id,
    TinhThanh.TenTinhThanh AS name,
    JSON_ARRAYAGG(QuanHuyen.TenQuanHuyen) AS district
FROM 
    TinhThanh
LEFT JOIN 
    QuanHuyen ON TinhThanh.ID_TinhThanh = QuanHuyen.ID_TinhThanh
GROUP BY 
    TinhThanh.ID_TinhThanh, TinhThanh.TenTinhThanh;
`,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      res.status(200).json({
        data: result,
        message: "Lấy danh sách địa điểm thành công",
      });
    }
  );
};

module.exports = {
    getLocation,
    };
