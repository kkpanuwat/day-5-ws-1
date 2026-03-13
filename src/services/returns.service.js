const returnsRepo = require('../repositories/returns.repo');

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

function forbidden(message) {
  const err = new Error(message);
  err.status = 403;
  return err;
}

function conflict(message) {
  const err = new Error(message);
  err.status = 409;
  return err;
}

function notFound(message) {
  const err = new Error(message);
  err.status = 404;
  return err;
}

async function returnBook({ userId, borrowId }) {
  if (!Number.isFinite(borrowId)) throw badRequest('borrowId is required');

  const borrow = await returnsRepo.getBorrowById(borrowId);
  if (!borrow) throw notFound('Borrow not found');
  if (Number(borrow.user_id) !== Number(userId)) throw forbidden('Forbidden');
  if (borrow.returned_at) throw conflict('Already returned');

  const updated = await returnsRepo.returnBorrow({ borrowId, userId });
  if (!updated) throw conflict('Already returned');
  return updated;
}

module.exports = { returnBook };