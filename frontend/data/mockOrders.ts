import type { Order } from "@/types/order";

/** Sample orders so the admin orders view is not empty in the prototype. */
export const mockOrders: Order[] = [
  {
    id: "WNX-1001",
    createdAt: "2026-08-09T10:30:00.000Z",
    customer: { name: "Alice Tan", phone: "9123 4567" },
    pickupDate: "2026-08-10",
    pickupTime: "12:00",
    subtotalCents: 1330,
    status: "confirmed",
    payment: {
      method: "PayNow",
      transactionId: "PAYNOW-WNX-1001-DEMO",
      paidAt: "2026-08-09T10:31:12.000Z",
    },
    lines: [
      {
        id: "WNX-1001-1",
        productSlug: "chicken-rice",
        productName: "Chicken Rice",
        image: "/images/chicken-rice.png",
        unitPriceCents: 450,
        quantity: 1,
        selection: {},
      },
      {
        id: "WNX-1001-2",
        productSlug: "dry-laksa",
        productName: "Dry Laksa",
        image: "/images/dry-laksa-placeholder.svg",
        unitPriceCents: 880,
        quantity: 1,
        selection: {
          sizeId: "large",
          sizeName: "Large",
          choiceGroupName: "Spice level",
          choiceId: "da-la",
          choiceName: "Da La",
          checkboxIds: ["no-bean-sprouts"],
          checkboxNames: ["No bean sprouts"],
        },
      },
    ],
  },
  {
    id: "WNX-1002",
    createdAt: "2026-08-10T02:15:00.000Z",
    customer: { name: "Ben Lim", phone: "9876 5432" },
    pickupDate: "2026-08-10",
    pickupTime: "17:30",
    subtotalCents: 1420,
    status: "awaiting_payment",
    lines: [
      {
        id: "WNX-1002-1",
        productSlug: "char-siew-rice",
        productName: "Char Siew Rice",
        image: "/images/char-siew-rice.png",
        unitPriceCents: 550,
        quantity: 2,
        selection: {},
      },
      {
        id: "WNX-1002-2",
        productSlug: "chicken-soup-rice",
        productName: "Chicken Soup Rice",
        image: "/images/chicken-soup-rice.png",
        unitPriceCents: 320,
        quantity: 1,
        selection: {},
      },
    ],
  },
];
