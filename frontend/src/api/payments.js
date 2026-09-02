import client from "./client";

// TENANT
export const getMyPayments = () => client.get("/payments/my").then((r) => r.data);
export const payPayment = (id, paymentMethod, transactionReference) =>
  client
    .put(`/payments/${id}/pay`, { paymentMethod, transactionReference })
    .then((r) => r.data);

// OWNER / ADMIN
export const getPaymentsByAgreement = (agreementId) =>
  client.get(`/payments/agreement/${agreementId}`).then((r) => r.data);
export const generatePayment = (agreementId) =>
  client.post("/payments/generate", { agreementId }).then((r) => r.data);

// Shared
export const getPaymentById = (id) => client.get(`/payments/${id}`).then((r) => r.data);
