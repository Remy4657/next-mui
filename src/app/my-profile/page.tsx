"use client";
// ** Next
import { NextPage } from "next";

// ** React
import { useEffect, useState } from "react";

// ** Mui
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputLabel,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

// ** Components
import CustomTextField from "src/component/text-field";
import Icon from "src/component/Icon";
// import WrapperFileUpload from "src/components/wrapper-file-upload";

// ** form
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Config
import { EMAIL_REG } from "src/config/regex";

// ** Translate

// ** services
import { getAuthMe } from "src/services/auth";
import { getAllRoles } from "src/services/role";
import { getAllCities } from "src/services/city";

// ** Utils
import { convertBase64, separationFullName, toFullName } from "src/utils";

// ** Redux
import { updateAuthMeAsync } from "src/redux/users/actions";
import { resetInitialState } from "src/redux/users/index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/redux/store";

// ** component
// import FallbackSpinner from "src/components/fall-back";

// ** context
import { UseAuth } from "src/hooks/useAuth";

// ** Other
import toast from "react-hot-toast";
import Spinner from "src/component/spinner";
import CustomSelect from "src/component/custom-select";

type TProps = {};

type TDefaultValue = {
  email: string;
  address: string;
  city: string;
  phoneNumber: string;
  role: string;
  fullName: string;
};

const MyProfilePage: NextPage<TProps> = () => {
  const { user } = UseAuth();

  // State
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [optionRoles, setOptionRoles] = useState<
    { label: string; value: string }[]
  >([]);
  const [isDisabledRole, setIsDisabledRole] = useState(false);
  const [optionCities, setOptionCities] = useState<
    { label: string; value: string }[]
  >([]);
  console.log(optionRoles);

  // ** Hooks

  // ** theme
  const theme = useTheme();

  // ** redux
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, isErrorUpdateMe, messageUpdateMe, isSuccessUpdateMe } =
    useSelector((state: RootState) => state.users);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Required field")
      .matches(EMAIL_REG, "The field is must email type"),
    fullName: yup.string().notRequired(),
    phoneNumber: yup
      .string()
      .required("Required field")
      .min(9, "The phone number is min 9 number"),
    role: isDisabledRole
      ? yup.string().notRequired()
      : yup.string().required("Required_field"),
    city: yup.string().notRequired(),
    address: yup.string().notRequired(),
  });

  const defaultValues: TDefaultValue = {
    email: "",
    address: "",
    city: "",
    phoneNumber: "",
    role: "",
    fullName: "",
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  // fetch api
  const fetchGetAuthMe = async () => {
    setLoading(true);
    await getAuthMe()
      .then(async (response) => {
        setLoading(false);
        const data = response?.data;
        if (data) {
          setIsDisabledRole(!data?.role?.permissions?.length);
          reset({
            email: data?.email,
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber,
            role: data?.role?._id,
            fullName: toFullName(
              data?.lastName,
              data?.middleName,
              data?.firstName,
              "vi"
            ),
          });
          setAvatar(data?.avatar);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const fetchAllRoles = async () => {
    setLoading(true);
    await getAllRoles()
      .then((res) => {
        console.log("res: ", res);
        const data = res?.data.roles;
        if (data) {
          setOptionRoles(
            data?.map((item: { name: string; _id: string }) => ({
              label: item.name,
              value: item._id,
            }))
          );
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const fetchAllCities = async () => {
    setLoading(true);
    await getAllCities({ params: { limit: 20, page: 1 } })
      .then((res) => {
        const data = res?.data.cities;
        if (data) {
          setOptionCities(
            data?.map((item: { name: string; _id: string }) => ({
              label: item.name,
              value: item._id,
            }))
          );
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchGetAuthMe();
  }, [user]);

  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe);
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe);
        fetchGetAuthMe();
      }
      dispatch(resetInitialState());
    }
  }, [isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe]);

  useEffect(() => {
    fetchAllRoles();
    fetchAllCities();
  }, []);

  const onSubmit = (data: any) => {
    const { firstName, lastName, middleName } = separationFullName(
      data.fullName,
      "vi"
    );
    dispatch(
      updateAuthMeAsync({
        email: data.email,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        role: data.role,
        phoneNumber: data.phoneNumber,
        avatar,
        address: data.address,
        city: data.city,
      })
    );
  };

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file);
    setAvatar(base64 as string);
  };

  return (
    <>
      {loading || (isLoading && <Spinner />)}
      <Container maxWidth="xl">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
          <Grid
            container
            sx={{
              marginTop: "30px",
            }}
          >
            <Grid
              container
              item
              md={6}
              xs={12}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "15px",
              }}
            >
              <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
                <Grid container spacing={4}>
                  <Grid item md={12} xs={12}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        {avatar && (
                          <IconButton
                            sx={{
                              position: "absolute",
                              bottom: -4,
                              right: -6,
                              zIndex: 2,
                              color: theme.palette.error.main,
                            }}
                            edge="start"
                            color="inherit"
                            onClick={() => setAvatar("")}
                          >
                            <Icon icon="material-symbols-light:delete-outline" />
                          </IconButton>
                        )}
                        {avatar ? (
                          <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                            <Icon icon="ph:user-thin" fontSize={70} />
                          </Avatar>
                        ) : (
                          <Avatar sx={{ width: 100, height: 100 }}>
                            <Icon icon="ph:user-thin" fontSize={70} />
                          </Avatar>
                        )}
                      </Box>
                      {/* <WrapperFileUpload
                      uploadFunc={handleUploadAvatar}
                      objectAcceptFile={{
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          width: "auto",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Icon icon="ph:camera-thin"></Icon>
                        {avatar ? t("Change_avatar") : t("Upload_avatar")}
                      </Button>
                    </WrapperFileUpload> */}
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CustomTextField
                          required
                          fullWidth
                          disabled
                          label={"Email"}
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          placeholder={"Enter your email"}
                          error={Boolean(errors?.email)}
                          helperText={errors?.email?.message}
                        />
                      )}
                      name="email"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    {!isDisabledRole && (
                      <Controller
                        control={control}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <div>
                            <label
                              style={{
                                fontSize: "13px",
                                marginBottom: "4px",
                                display: "block",
                                color: errors?.role
                                  ? theme.palette.error.main
                                  : `rgba(255, 99, 71, 0.42)`,
                              }}
                            >
                              {"Role"}{" "}
                              <span style={{ color: theme.palette.error.main }}>
                                *
                              </span>
                            </label>

                            <CustomSelect
                              fullWidth
                              disabled
                              onChange={onChange}
                              options={optionRoles}
                              error={Boolean(errors?.role)}
                              onBlur={onBlur}
                              value={value}
                            />
                            {errors?.role?.message && (
                              <FormHelperText
                                sx={{
                                  color: errors?.role
                                    ? theme.palette.error.main
                                    : `rgba(255, 99, 71, 0.42)`,
                                }}
                              >
                                {errors?.role?.message}
                              </FormHelperText>
                            )}
                          </div>
                        )}
                        name="role"
                      />
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "15px",
                  py: 5,
                  display: "flex",
                }}
                marginLeft={{ md: 5, xs: 0 }}
              >
                <Grid container spacing={4}>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CustomTextField
                          fullWidth
                          label={"Full_name"}
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          placeholder={"Enter_your_full_name"}
                          error={Boolean(errors?.fullName)}
                          helperText={errors?.fullName?.message}
                        />
                      )}
                      name="fullName"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      name="address"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CustomTextField
                          fullWidth
                          label={"Address"}
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          placeholder={"Enter_your_address"}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Box>
                          <InputLabel
                            sx={{
                              fontSize: "13px",
                              marginBottom: "4px",
                              display: "block",
                              color: errors?.city
                                ? theme.palette.error.main
                                : `rgba(255, 99, 71, 0.42)`,
                            }}
                          >
                            {"City"}
                          </InputLabel>
                          <CustomSelect
                            fullWidth
                            onChange={onChange}
                            options={optionCities}
                            error={Boolean(errors?.city)}
                            onBlur={onBlur}
                            value={value}
                          />
                          {errors?.city?.message && (
                            <FormHelperText
                              sx={{
                                color: errors?.city
                                  ? theme.palette.error.main
                                  : `rgba(255, 99, 71, 0.42)`,
                              }}
                            >
                              {errors?.city?.message}
                            </FormHelperText>
                          )}
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CustomTextField
                          required
                          fullWidth
                          label={"Phone_number"}
                          onChange={(e) => {
                            const numValue = e.target.value.replace(/\D/g, "");
                            onChange(numValue);
                          }}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            minLength: 8,
                          }}
                          onBlur={onBlur}
                          value={value}
                          placeholder={"Enter_your_phone"}
                          error={Boolean(errors?.phoneNumber)}
                          helperText={errors?.phoneNumber?.message}
                        />
                      )}
                      name="phoneNumber"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              {"Update"}
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default MyProfilePage;
