import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export function afterBirth({ birth }: { birth: string }) {
  const today = dayjs();
  return dayjs.duration(today.diff(birth));
}

export function ageDeath({ birth, death }: { birth: string; death: string }) {
  const deathDayJs = dayjs(death);
  return dayjs.duration(deathDayJs.diff(birth));
}
