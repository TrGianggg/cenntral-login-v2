export default {
  tomxu: {
    token: 'Tom xu',
    sent: 'Chuyển',
    received: 'Nhận',
    tab_1: 'Trang quản lý giao dịch',
    tab_2: 'Trang mua bán P2P',
    table_transaction_manager: {
      column_1: 'Mã giao dịch',
      column_2: 'Loại giao dịch',
      column_3: 'Số lượng',
      column_4: 'Từ',
      column_5: 'Đến',
      column_6: 'Thời gian',
      column_7: 'Phí giao dịch',
      column_8: 'Token',
      column_9: 'Note'
    },
    transaction: 'Giao dịch',
    modal_transfer_tomxu: {
      title_main: 'Chuyển CP',
      amount: 'Số lượng',
      min_amount: 'Số lượng phải lớn hơn 0',
      max_amount: 'Số lượng phải nhỏ hơn số dư P hiện có',
      user_name: 'Tên hoặc email người nhận',
      otp: 'Xác thực OTP',
      two_fa: 'Xác thực 2FA',
      amount_empty: '@:tomxu.modal_transfer_tomxu.amount @:common.validate.empty',
      user_name_empty: '@:tomxu.modal_transfer_tomxu.user_name @:common.validate.empty',
      otp_empty: '@:tomxu.modal_transfer_tomxu.otp @:common.validate.empty',
      two_fa_empty: '@:tomxu.modal_transfer_tomxu.two_fa @:common.validate.empty',
      sent_success: 'Gửi CP thành công đến người nhận: {email}'
    },
    modal_receive_tomxu: {
      title_qr: 'Cung cấp mã QR Code này cho người chuyển để nhận tiền',
      title_qr_1: 'Hoặc nhận theo địa chỉ dưới đây:'
    },
    qr_scanner_title: 'Hướng camera về phía mã QR',
    fee: 'Phí',
    what_p_tomxu: 'P là gì?',
    transaction_history: 'Lịch sử giao dịch',
    agency: 'Đại lý',
    volume_transaction: 'Khối lượng giao dịch',
    amount_transaction: 'Số lượng giao dịch',
    confirm_swap: 'Xác nhận chuyển đổi:',
    ptomxu_detail:
      'P là thưởng hoàn phí khi thành viên trong mạng lưới của bạn mua gói thành viên Tomiru. Bạn có thể yêu cầu chuyển đổi thành CP khi trở thành thành viên của Tomiru và giới thiệu được từ 03 thành viên trở lên trong tháng ở chu kỳ đầu tiên hoặc từ 01 thành viên trở lên ở các chu kỳ tiếp theo.'
  }
}
