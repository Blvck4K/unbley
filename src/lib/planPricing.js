const toMoney = (value) => Math.max(0, Number(value) || 0);

export const calculateBusinessUpgradePrice = ({ businessPrice, businessUsdPrice, starterPrice, starterUsdPrice, starterInterval = 'monthly', planEndsAt, isActiveTrial = false, now = Date.now() }) => {
  const normalNgn = toMoney(businessPrice);
  const normalUsd = toMoney(businessUsdPrice);

  if (isActiveTrial || !planEndsAt || !starterPrice) {
    return { ngn: normalNgn, usd: normalUsd, prorated: false };
  }

  const totalDays = starterInterval === 'yearly' ? 365 : 30;
  const planEnds = new Date(planEndsAt).getTime();
  if (!Number.isFinite(planEnds)) return { ngn: normalNgn, usd: normalUsd, prorated: false };

  const planStartedAt = planEnds - totalDays * 86400000;
  const daysUsed = Math.min(totalDays, Math.max(0, Math.ceil((Number(now) - planStartedAt) / 86400000)));
  const remainingDays = totalDays - daysUsed;
  const ngnCredit = toMoney(starterPrice) * remainingDays / totalDays;
  const usdCredit = toMoney(starterUsdPrice) * remainingDays / totalDays;

  return {
    ngn: Math.max(0, Math.round(normalNgn - ngnCredit)),
    usd: Math.max(0, Number((normalUsd - usdCredit).toFixed(2))),
    prorated: true,
    creditNgn: Math.round(ngnCredit),
    creditUsd: Number(usdCredit.toFixed(2)),
    remainingDays
  };
};
