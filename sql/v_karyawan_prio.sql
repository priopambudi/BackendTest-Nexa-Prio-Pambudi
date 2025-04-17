USE gmedia_democase;

CREATE OR REPLACE VIEW karyawan_prio AS
SELECT
  ROW_NUMBER() OVER (ORDER BY id) AS No,
  nip AS Nip,
  nama AS Nama,
  alamat AS Alamat,
  CASE 
    WHEN gend = 'L' THEN 'Laki - Laki'
    WHEN gend = 'P' THEN 'Perempuan'
    ELSE 'Tidak Diketahui'
  END AS Gend,
  DATE_FORMAT(tgl_lahir, '%e %M %Y') AS `Tanggal Lahir`
FROM
  karyawan;
