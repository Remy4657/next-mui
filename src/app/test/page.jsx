"use client";

import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box, TextField } from "@mui/material";
import { useState } from "react";

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
    </>
  );
};

export default Test;
