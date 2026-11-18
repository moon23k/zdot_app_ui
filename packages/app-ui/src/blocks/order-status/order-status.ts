export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'canceled';

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending_payment: '결제 대기',
  paid: '신규 주문',
  preparing: '배송 준비',
  shipped: '배송 중',
  delivered: '배송 완료',
  completed: '구매 확정',
  canceled: '주문 취소',
};

export type OrderFulfillment = 'ship' | 'pickup' | 'local' | 'visit' | 'none';

export type OrderStatusInput = {
  status: OrderStatus;
  fulfillment?: OrderFulfillment;
  readyAt?: string | null;
};

export function orderStatusText({
  status,
  fulfillment = 'ship',
  readyAt,
}: OrderStatusInput): string {
  if (fulfillment === 'pickup') {
    if (status === 'preparing' && readyAt) return '픽업 준비 완료';
    if (status === 'delivered') return '수령 완료';
  }
  return orderStatusLabel[status];
}
