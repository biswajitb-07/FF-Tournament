import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;
const WALLET_API = `${BASE_URL}/api/v1/wallet/`;

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: fetchBaseQuery({
    baseUrl: WALLET_API,
    credentials: "include",
  }),
  tagTypes: ["wallet"],
  endpoints: (builder) => ({
    getWalletBalance: builder.query({
      query: () => "balance",
      providesTags: ["wallet"],
    }),
    addMoney: builder.mutation({
      query: ({ amount }) => ({ url: "add", method: "POST", body: { amount } }),
    }),
    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: "verify",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["wallet"],
    }),
    getTransactions: builder.query({
      query: () => "transactions",
      providesTags: ["wallet"],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["wallet"],
    }),
    requestWithdrawal: builder.mutation({
      query: ({ amount, method }) => ({
        url: "withdraw",
        method: "POST",
        body: { amount, method },
      }),
      invalidatesTags: ["wallet"],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useAddMoneyMutation,
  useVerifyPaymentMutation,
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
  useRequestWithdrawalMutation
} = walletApi;
