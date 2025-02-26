"use client";

import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";

const Test = () => {
  const [selectedTime, setEndSelectedTime] = useState(null);
  const [startSelectedTime, setStartSelectedTime] = useState(null);
  const [valueNumber, setValueNumber] = useState("");

  const [error, setError] = useState(false);
  const [error1, setError1] = useState(false);

  const handleStartTimeChange = (newTime) => {
    const endTime = newTime.add(valueNumber, "hour");
    console.log("end time: ", endTime);
    setStartSelectedTime(newTime);
    setEndSelectedTime(endTime);

    if ((newTime && newTime.hour() > 18) || (newTime && newTime.hour() < 8)) {
      setError1(true);
    } else {
      setError1(false);
    }

    if (endTime.hour() > 18) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleEndTimeChange = (newTime) => {
    //const timePlusOneHour = newTime.add(valueNumber, "hour").format("HH:mm");
    //console.log(`timePlusOneHour: ${timePlusOneHour}`);
    //setEndSelectedTime(timePlusOneHour);
    // Kiểm tra nếu giờ được chọn > 3:00 PM (15:00)
    // if (newTime && newTime.hour() >= 15) {
    //   setError(true);
    // } else {
    //   setError(false);
    // }
  };

  const onChangeNumber = (e) => {
    console.log(e.target.value);
    setValueNumber(e.target.value);
    console.log("startSelectedTime: ", startSelectedTime);
    setEndSelectedTime(startSelectedTime.add(e.target.value, "hour"));

    if (startSelectedTime.add(e.target.value, "hour").hour() > 18) {
      setError(true);
    } else {
      setError(false);
    }
  };

  //
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberMonth, setNumberMonth] = useState("");

  const handleStartDateOnChange = (newValue) => {
    //console.log(event.target);
    console.log(newValue?.format("YYYY-MM-DD"));
    setStartDate(newValue ? newValue?.format("YYYY-MM-DD") : null);
    setEndDate(newValue ? newValue?.add(numberMonth, "month") : null); // Add 1 month
    if (!newValue) {
      setNumberMonth("");
    }
    // setSelectedDate(updatedDate);
  };
  const onChangeNumberMonth = (event) => {
    setNumberMonth(event.target.value);
    setEndDate(dayjs(startDate).add(event.target.value, "month")); // Add 1 month
  };
  return (
    <>
      <Box sx={{ m: 3 }}>
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Basic date picker"
              minutesStep={30}
              value={startSelectedTime}
              onChange={handleStartTimeChange}
              slotProps={{
                field: {
                  readOnly: true,
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider> */}
      </Box>

      <Box sx={{ display: "flex", gap: "15px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="Basic time picker"
              minutesStep={30}
              value={startSelectedTime}
              onChange={handleStartTimeChange}
              slotProps={{
                textField: {
                  error: error1,
                  helperText: error1
                    ? "Thời gian không hợp lệ! Vui lòng chọn trước 8:00 a.m"
                    : "",
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        <TextField
          label="number"
          value={valueNumber}
          placeholder="Number..."
          variant="outlined"
          onChange={onChangeNumber}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="Basic time picker"
              minutesStep={30}
              value={selectedTime}
              onChange={handleEndTimeChange}
              slotProps={{
                textField: {
                  error: error,
                  helperText: error ? "Thời gian không hợp lệ" : "",
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
      <Box sx={{ mt: 3, display: "flex" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Start date"
              // value={dayjs(startDate)}
              onChange={handleStartDateOnChange}
              slotProps={{
                field: {
                  readOnly: true,
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            type="number"
            disabled={!startDate}
            slotProps={{
              input: {
                min: 1,
                max: 12,
                onInput: (e) => {
                  const value = e.target.value;
                  if (value < 1) e.target.value = 1;
                  if (value > 12) e.target.value = 12;
                },
              },
            }}
            value={numberMonth}
            onChange={onChangeNumberMonth}
          />
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker label="End date" value={endDate} disabled={true} />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
    </>
  );
};

export default Test;
