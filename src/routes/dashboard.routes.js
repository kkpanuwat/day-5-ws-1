const express = require('express');
const authRequired = require('../middlewares/authRequired');
const { getDashboardStats, listRecentBorrows } = require('../repositories/dashboard.repo');

const router = express.Router();

router.get('/', authRequired, async (_req, res, next) => {
  try {
    const stats = await getDashboardStats();
    const recentBorrows = await listRecentBorrows(5);

    const normalizedBorrows = recentBorrows.map((item) => {
      const returnedAt = item.returned_at || null;
      const dueDate = item.due_date;
      const overdue = !returnedAt && new Date(dueDate).getTime() < Date.now();

      return {
        id: String(item.id),
        userId: String(item.user_id),
        userName: item.user_name || '-',
        bookId: String(item.book_id),
        bookTitle: item.book_title || '-',
        borrowDate: item.borrowed_at,
        dueDate,
        returnDate: returnedAt,
        status: returnedAt ? 'returned' : overdue ? 'overdue' : 'borrowing',
      };
    });

    res.json({
      stats: {
        totalBooks: Number(stats?.total_books || 0),
        availableBooks: Number(stats?.available_books || 0),
        borrowedBooks: Number(stats?.borrowed_books || 0),
        usersCount: Number(stats?.users_count || 0),
        overdueCount: Number(stats?.overdue_count || 0),
      },
      recentBorrows: normalizedBorrows,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
