import { getWeekDays } from "@/utils/get-week-days";
import dayjs from "dayjs";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useMemo, useState } from "react";
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "./styles";

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = CalendarWeek[];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1);
  });

  function handlePreviousMonth() {
    const previousMonth = currentDate.subtract(1, "month");
    setCurrentDate(previousMonth);
  }

  function handleNextMonth() {
    const nextMonth = currentDate.add(1, "month");
    setCurrentDate(nextMonth);
  }

  const shortWeekDays = getWeekDays({ short: true });
  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => {
      return currentDate.set("date", index + 1);
    });

    const firstWeekDay = currentDate.get("day");

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, index) => {
        return currentDate.subtract(index + 1, "day");
      })
      .reverse();

    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth()
    );

    const lastWeekDay = lastDayInCurrentMonth.get("day");

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => {
      return lastDayInCurrentMonth.add(index + 1, "day");
    });

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return {
          date,
          disabled: true,
        };
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled: false,
        };
      }),
      ...nextMonthFillArray.map((date) => {
        return {
          date,
          disabled: true,
        };
      }),
    ];

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0;

        if (isNewWeek) {
          weeks.push({
            week: index / 7 + 1,
            days: original.slice(index, index + 7),
          });
        }

        return weeks;
      },
      []
    );

    return calendarWeeks;
  }, [currentDate]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Mês anterior">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Próximo mês">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ days, week }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => (
                  <td key={date.toString()}>
                    <CalendarDay disabled={disabled}>
                      {date.get("date")}
                    </CalendarDay>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}
