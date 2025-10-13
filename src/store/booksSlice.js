import { createSlice } from '@reduxjs/toolkit';

export const booksSlice = createSlice({
  name: 'books',
  initialState: [
    {
      id: 1,
      title: "Vật lý 1",
      cover:
        "https://images.vnuhcmpress.edu.vn/Picture/2023/8/9/image-20230809095349521.jpg",
      isRead: true,
      author: "Phan Ngọc Khương Cát",
      synopsis: "Vật lý 1 là môn khoa học nghiên cứu về các dạng vận động của vật chất và năng lượng, bao gồm cơ học, nhiệt học, điện học, từ học và quang học, nhằm cung cấp kiến thức cơ bản về thế giới tự nhiên, phát triển tư duy và ứng dụng trong thực tế."
    },
    {
      id: 2,
      title: "Chủ nghĩa xã hội khoa học",
      cover:
        "https://nxbctqg.org.vn/img_data/images/526072223378_cnkv.jpg",
      isRead: false,
      author: "Đặng Kiều Diễm",
      synopsis: "Bao gồm các vấn đề cốt lõi về sự ra đời, phát triển của chủ nghĩa xã hội khoa học, vai trò của C. Mác, Ph. Ăng-ghen, V.I. Lênin; Sứ mệnh lịch sử của giai cấp công nhân; Lý luận về chủ nghĩa xã hội và thời kỳ quá độ lên chủ nghĩa xã hội."
    },
    {
      id: 3,
      title: "Giải tích 2",
      cover:
        "https://images.vnuhcmpress.edu.vn/Picture/2023/giao-tich-2.jpg",
      isRead: false,
      author: "Nguyễn Thị Xuân Anh",
      synopsis: "Giải tích II chủ yếu dành cho phép tính tích phân đối với hàm số nhiều biến số, với nhiều ứng dụng khác nhau trong các bài toán đo đạc, như tính độ dài, diện tích, thể tích, khối lượng, công của lực, v.v.."
    },
    {
      id: 4,
      title: "Triết học Mác Lê-nin",
      cover:
        "https://images.sachquocgia.vn/Picture/2024/3/21/image-20240321142038119.jpg",
      isRead: false,
      author: "Nguyễn Thị Minh Hương",
      synopsis: "Giáo trình môn Triết học Mác - Lênin có nội dung cốt lõi gồm ba bộ phận chính: chủ nghĩa duy vật biện chứng, phép biện chứng duy vật và chủ nghĩa duy vật lịch sử, giải quyết các quy luật chung nhất của tự nhiên, xã hội và tư duy."
    }
  ],
  reducers: {
    addBook: (books, action) => {
      let newBook = action.payload;
      newBook.id = books.length ? Math.max(...books.map(book => book.id)) + 1 : 1;
      books.push(newBook);
    },
    eraseBook: (books, action) => {
        return books.filter(book => book.id != action.payload);
    },
    toggleRead: (books, action) => {
        books.map(book => {
          if (book.id == action.payload) {
            book.isRead = !book.isRead;
          }
        });
    }
  }
})

export const { addBook, eraseBook, toggleRead } = booksSlice.actions;

export const selectBooks = state => state.books;

export default booksSlice.reducer;