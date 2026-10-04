/** Build-time tuning; defaults preserve the current game and existing saves. */
export const gameConfig = {
 stress: {
  /** Positive gains only: 0 disables gains, 2 doubles them. Recovery is unchanged. */
  gainMultiplier: 1,
  overtimePerHalfHour: 4, performanceAccepted: 3, performanceRejected: 10,
  heatPerDay: 4, disruptionPerDay: 3, routineWorkday: 7, routineRestDay: 8,
  vacationRecoveryPerDay: 5,
 },
 clock: {workdayStart: 540, lastTaskStart: 1020, workdayEnd: 1080, eveningEnd: 1440},
 character: {startingMoney: 45000, startingEnergy: 100, startingStress: 15},
 economy: {paidWorkdaysPerMonth: 22, sleepEnergy: 65, sleepStress: 6, maximumSleepStressRecovery: 12},
 evening: {walk: 45, cook: 40, read: 60, games: 60},
 ui: {desktopQuery: '(min-width:1024px)', compactQuery: '(max-width:1023px)'},
};
