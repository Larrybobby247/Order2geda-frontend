export const FAQS = [
  ['What is Order2Geda?', 'Order2Geda is a group-buying community. Shoppers join a room, add the items they want from stores like Temu, Shein and AliExpress, and a moderator combines everyone\'s items into one bulk order so nobody has to reach a store\'s minimum purchase alone.'],
  ['How much does it cost?', 'You pay your product subtotal plus a 10% service commission on that subtotal. Shipping is billed separately: after the room closes your moderator reviews your order and sets your shipping fee, which you pay as a second, separate payment. There are no hidden charges.'],
  ['When does a room close?', 'A room closes automatically once the paid product value reaches the original target plus a 5% buffer (for example ₦30,000 becomes ₦31,500). Only paid items count. After that, nobody can join or add products and unpaid items are cancelled.'],
  ['When do I pay?', 'Joining a room and building your list is free. You pay by card or bank through Paystack as soon as your list is ready. Only paid items count toward the room, and paid items cannot be edited (you can add and pay for more). Unpaid items are removed if the room fills first.'],
  ['How is shipping calculated?', 'After the room closes, your moderator verifies each order and sets an individual shipping fee. You get an invoice and a notification when it is ready, and you pay it separately from your products. If an unpaid fee needs adjusting, you are notified.'],
  ['Can I get a refund?', 'Yes. Eligible orders are refunded in full, including the commission. Once an admin confirms your refund transfer, your entire individual order is cancelled. Other participants\' orders are never affected.'],
  ['Are private rooms really private?', 'Yes. Private rooms never appear in discovery. They can only be joined through a secure, expiring invitation link that the room creator can revoke and regenerate.'],
  ['Who are moderators?', 'Moderators are vetted people invited by our administrators. They verify products, place the bulk order, update tracking and keep the room chat healthy. They are paid by Order2Geda, not from your product money.'],
  ['How does the referral reward work?', 'Share your referral link. When a friend you invited completes their first paid purchase, a reward (₦500 by default) is credited to your in-app wallet. Rewards on refunded orders are reversed.'],
];
export const STEPS = [
  ['Find or create a room', 'Browse public rooms for your favourite store or start your own, public or invite-only.'],
  ['Add the products you want', 'Paste a product link, set price, size and colour. The room progress bar updates live for everyone.'],
  ['Pay for your items', 'Pay as soon as your list is ready. Only paid items count toward the room, and they lock once paid. When the target + 5% buffer is reached the room closes and unpaid items are removed.'],
  ['Shipping, then delivery', 'Your moderator reviews your order and sets your shipping fee. Pay it, and your order is dispatched and delivered.'],
];
export const JOURNEY = ['You pay for items', 'Room fills & closes', 'Shipping fee set', 'You pay shipping', 'Ready for dispatch', 'Dispatched', 'Delivered'];
const DRAFT = 'This document is a draft written for the Order2Geda product. It must be reviewed by a qualified Nigerian lawyer, and the items in [brackets] confirmed by the business, before launch.';
export const POLICIES = {
  terms: { title: 'Terms and Conditions', sub: 'The rules for using Order2Geda.', draft: DRAFT, sections: [
    ['Who can use Order2Geda', 'You must be at least 18 years old and provide accurate account information. You are responsible for activity on your account and for keeping your password secure.'],
    ['How group buying works', 'Order2Geda helps shoppers combine purchases to meet third-party store minimums. We are not the store. Prices, availability and delivery of items depend on the external store, and a bulk order is only placed after payment is confirmed.'],
    ['Fees and payment', 'You pay your product subtotal, a 10% service commission on that subtotal, and a separately invoiced shipping fee set by your room moderator after the room closes. All amounts are shown before you pay. Payments are processed by Paystack. We never see or store your full card details.'],
    ['Rooms and products', 'You must describe products accurately and may not submit prohibited, counterfeit or illegal items. Moderators may flag, reject or remove products and messages. Rooms close automatically at the target plus the configured buffer.'],
    ['Refunds and cancellations', 'Eligible orders are refunded in full as described in our Refund Policy. A completed refund cancels your entire individual order.'],
    ['Suspension', 'We may suspend or close accounts that break these terms, attempt fraud, abuse other members or misuse the platform.'],
    ['Liability', 'We take reasonable care to run the service but cannot control third-party stores, couriers or customs. [Business and legal to define liability limits.]'],
    ['Governing law', 'These terms are governed by the laws of the Federal Republic of Nigeria. [Confirm dispute-resolution venue.]'] ] },
  privacy: { title: 'Privacy Policy', sub: 'What we collect, why, and your choices.', draft: DRAFT, sections: [
    ['What we collect', 'Account details (name, email, phone), delivery addresses, the products you submit, chat messages in rooms you join, payment references from Paystack, and bank details you provide for refunds (stored encrypted).'],
    ['How we use it', 'To run rooms and orders, process payments and refunds, send transactional emails and notifications, prevent fraud and abuse, and improve the service.'],
    ['Who we share it with', 'Service providers that help us operate: Paystack (payments), Resend (email), Cloudinary (images), Firebase (push notifications) and our hosting and database providers. Moderators see the product and order details needed to place your group order. We do not sell your data.'],
    ['Security', 'Passwords are hashed, sensitive refund details are encrypted, access is role-based and administrative actions are logged.'],
    ['Retention', 'We keep financial, order and audit records for as long as the law and our accounting require. You can ask us to delete other data.'],
    ['Your rights', 'Under the Nigeria Data Protection Act 2023 you may request access, correction or deletion of your personal data. Contact us through the Contact page. [Add registered entity details and DPO contact.]'] ] },
  refunds: { title: 'Refund Policy', sub: 'Full eligible refunds, handled transparently.', draft: DRAFT, sections: [
    ['Full eligible refund', 'If your order is eligible, you are refunded the full amount you paid, including the service commission. [Business to define eligibility conditions and any request window.]'],
    ['How to request', 'Open your order and choose Request refund. Provide a reason and the bank account to receive the transfer. You will see the refund status at every step.'],
    ['What happens next', 'An administrator reviews your request and, if approved, sends the transfer manually and records the reference. Refunds are not automatic and processing time depends on the review and your bank.'],
    ['Your order is cancelled', 'When the refund is confirmed as completed, your entire individual order is cancelled and removed from the group\'s bulk order. Your records are kept in your order history.'],
    ['Other participants are unaffected', 'Cancelling your order never changes or cancels other people\'s orders in the same room.'],
    ['If the bulk order was already placed', 'The case is flagged for administrators to resolve with the external store. This can take longer, and we will keep you informed.'] ] },
  shipping: { title: 'Shipping Policy', sub: 'How group shipping is shared and tracked.', draft: DRAFT, sections: [
    ['Moderator-set shipping fees', 'After a room closes, its moderator verifies every confirmed order and sets an individual shipping fee. Fees are published together and each buyer receives an invoice.'],
    ['Separate payment', 'Shipping is a separate payment from your products, made through Paystack. Only verified payments mark an invoice as paid, and a paid fee cannot be changed.'],
    ['Adjustments', 'If an unpaid fee needs adjusting, your moderator can revise it and you are notified. Every change is recorded.'],
    ['Stages you can track', 'Bulk order placed, processing, shipped, in transit, customs clearance, arrived in Nigeria, sorting, ready for collection or out for delivery, and completed.'],
    ['Delivery in Nigeria', '[Business to define delivery and collection options, coverage areas and typical timelines.]'],
    ['Delays', 'International shipping and customs can cause delays outside our control. Your moderator will post updates in the room and on your order.'] ] },
};
