import { defineField, defineType } from "sanity";
import { CreditCardIcon } from "@sanity/icons";

export default defineType({
  name: "donationRecord",
  title: "Donation Record",
  type: "document",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "txRef",
      title: "Transaction Reference",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "donorName",
      title: "Donor Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "donorEmail",
      title: "Donor Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: [
          { title: "Ethiopian Birr (ETB)", value: "ETB" },
          { title: "US Dollar (USD)", value: "USD" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gateway",
      title: "Payment Gateway",
      type: "string",
      options: {
        list: [
          { title: "Chapa (Local)", value: "chapa" },
          { title: "Stripe (Global)", value: "stripe" },
          { title: "Sandbox / Demo", value: "demo" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Success / Completed", value: "success" },
          { title: "Failed", value: "failed" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isAnonymous",
      title: "Anonymous Donation",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "message",
      title: "Donor Note / Message",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "donorName",
      amount: "amount",
      currency: "currency",
      status: "status",
      gateway: "gateway",
    },
    prepare({ title, amount, currency, status, gateway }) {
      return {
        title: `${title || "Anonymous"} - ${currency || "ETB"} ${amount || 0}`,
        subtitle: `Status: ${status || "pending"} | Gateway: ${gateway || "demo"}`,
      };
    },
  },
});
