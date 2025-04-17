DELIMITER $$

CREATE PROCEDURE sp_add_kary_prio (
  IN p_nip VARCHAR(20),
  IN p_nama VARCHAR(100),
  IN p_alamat TEXT,
  IN p_gend CHAR(1),
  IN p_photo LONGTEXT,
  IN p_tgl_lahir DATE,
  IN p_status TINYINT,
  IN p_insert_by VARCHAR(50),
  IN p_user_id INT
)
BEGIN
  DECLARE exit handler for SQLEXCEPTION 
  BEGIN
    ROLLBACK;
    INSERT INTO log_trx_api (user_id, api, request, response, insert_at)
    VALUES (
      p_user_id,
      'POST /api/karyawan',
      CONCAT('NIP: ', p_nip, ', Nama: ', p_nama),
      'Gagal: Error SQL',
      NOW()
    );
    SELECT 'error_sql' AS status;
  END;

  START TRANSACTION;

  IF EXISTS (SELECT 1 FROM karyawan WHERE nip = p_nip) THEN
    INSERT INTO log_trx_api (user_id, api, request, response, insert_at)
    VALUES (
      p_user_id,
      'POST /api/karyawan',
      CONCAT('NIP: ', p_nip, ', Nama: ', p_nama),
      'Gagal: NIP sudah terdaftar',
      NOW()
    );
    ROLLBACK;
    SELECT 'duplicate' AS status;
  ELSE
    INSERT INTO karyawan (
      nip, nama, alamat, gend, photo, tgl_lahir, status, insert_at, insert_by, id
    ) VALUES (
      p_nip, p_nama, p_alamat, p_gend, p_photo, p_tgl_lahir, p_status, NOW(), p_insert_by, p_user_id
    );

    INSERT INTO log_trx_api (user_id, api, request, response, insert_at)
    VALUES (
      p_user_id,
      'POST /api/karyawan',
      CONCAT('NIP: ', p_nip, ', Nama: ', p_nama),
      'Berhasil',
      NOW()
    );

    SELECT 'success' AS status;
    COMMIT;
  END IF;
END$$

DELIMITER ;
