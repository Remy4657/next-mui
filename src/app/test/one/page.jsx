// "use client";

// import React, { useState, useEffect } from "react";
// import { Autocomplete, TextField } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";

// import CustomTextField from "./TextFieldCustom";

// const defaultValues = {
//   email: "",
// };

// const schema = z.object({
//   email: z.string().min(1, "Email is required").email("Invalid email format"),
// });

// const DropdownSearch = () => {
//   const [email, setEmail] = useState("");

//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//   } = useForm({
//     defaultValues: { email: "" },
//     mode: "onBlur",
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = (data) => {
//     console.log("Selected: ", data);
//   };
//   // 🔥 Giả lập API call để lấy email
//   useEffect(() => {
//     setTimeout(() => {
//       const apiEmail = "user@example.com"; // Giá trị lấy từ API
//       setEmail(apiEmail);
//       setValue("email", apiEmail); // Cập nhật vào react-hook-form
//     }, 1000); // Giả lập delay 1s
//   }, []);

//   const handleEmailChange = (e, field) => {
//     const value = e.target.value;
//     console.log(value);
//     setEmail(value); // Cập nhật state

//     field.onChange(e); // Cập nhật vào react-hook-form
//   };
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Controller
//         control={control}
//         rules={{
//           required: true,
//         }}
//         render={({ field }) => (
//           <CustomTextField
//             required
//             fullWidth
//             disabled={false}
//             label="Email"
//             onChange={(e) => handleEmailChange(e, field)}
//             onBlur={field.onBlur}
//             value={email}
//             placeholder="Enter_your_email"
//             error={Boolean(errors?.email)}
//             helperText={errors?.email?.message}
//           />
//         )}
//         name="email"
//       />
//       <Button type="submit">Submit</Button>
//     </form>
//   );
// };

// export default DropdownSearch;

// datepicker

"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const schema = z.object({
  date: z.date({ required_error: "Please select a date" }),
});

const DatePickerComponent = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    // Giả sử API trả về ngày hôm nay
    const apiDate = dayjs();
    setSelectedDate(apiDate);
    setValue("date", apiDate.toDate());
  }, [setValue]);

  const onSubmit = (data) => {
    console.log("Selected Date:", data.date);
    if (onChange) onChange(data.date);
  };

  const handleDateChange = (value, field) => {
    console.log("Selected Date:", value);
    setSelectedDate(value);
    field.onChange(value.toDate());
    if (onChange) onChange(value.toDate());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <DatePicker
            value={selectedDate}
            onChange={(value) => handleDateChange(value, field)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a date"
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default DatePickerComponent;
