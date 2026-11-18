export type ClaimStatus =
  | 'requested'
  | 'collecting'
  | 'collected'
  | 'held'
  | 'completed'
  | 'rejected'
  | 'withdrawn';

export const claimStatusLabel: Record<ClaimStatus, string> = {
  requested: '요청',
  collecting: '수거 중',
  collected: '수거 완료',
  held: '보류',
  completed: '완료',
  rejected: '거부',
  withdrawn: '철회',
};
