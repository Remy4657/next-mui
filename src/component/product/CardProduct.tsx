"use client";

// ** React
import React, { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

// ** Mui
import { styled, useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Box, Button, Rating } from "@mui/material";
import { TProduct } from "src/types/product";

// ** Redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/redux/store";

// ** Others
import { ROUTE_CONFIG } from "src/config/route";
import { createUrlQuery, formatNumberToLocal, isExpiry } from "src/utils";

// ** Hooks
import { UseAuth } from "src/hooks/useAuth";

interface TCardProduct {
  item: TProduct;
}

const StyleCard = styled(Card)(({ theme }) => ({
  position: "relative",
  boxShadow: theme.shadows[4],
  ".MuiCardMedia-root.MuiCardMedia-media": {
    objectFit: "contain",
  },
}));

const CardProduct = (props: TCardProduct) => {
  // ** Props
  const { item } = props;

  // ** Hooks
  const theme = useTheme();
  const router = useRouter();
  const { user } = UseAuth();
  const pathName = usePathname();

  // ** Redux
  const dispatch: AppDispatch = useDispatch();

  // ** handle
  const handleNavigateDetails = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`);
  };

  const handleUpdateProductToCart = (item: TProduct) => {
    const discountItem = isExpiry(item.discountStartDate, item.discountEndDate)
      ? item.discount
      : 0;
  };

  const handleBuyProductToCart = (item: TProduct) => {
    handleUpdateProductToCart(item);
    router.push(
      ROUTE_CONFIG.MY_CART + "?" + createUrlQuery("selected", item._id)
    );
  };

  const memoIsExpiry = useMemo(() => {
    return isExpiry(item.discountStartDate, item.discountEndDate);
  }, [item]);

  return (
    <StyleCard sx={{ width: "100%" }}>
      <CardMedia component="img" height="194" image={item.image} alt="image" />
      <CardContent sx={{ padding: "8px 12px" }}>
        <Typography
          onClick={() => handleNavigateDetails(item.slug)}
          variant="h5"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            cursor: "pointer",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            minHeight: "48px",
            mb: 2,
          }}
        >
          {item.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {item.discount > 0 && memoIsExpiry && (
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.error.main,
                fontWeight: "bold",
                textDecoration: "line-through",
                fontSize: "14px",
              }}
            >
              {formatNumberToLocal(item.price)} VND
            </Typography>
          )}
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {item.discount > 0 && memoIsExpiry ? (
              <>
                {formatNumberToLocal(
                  (item.price * (100 - item.discount)) / 100
                )}
              </>
            ) : (
              <>{formatNumberToLocal(item.price)}</>
            )}{" "}
            VND
          </Typography>
          {item.discount > 0 && memoIsExpiry && (
            <Box
              sx={{
                backgroundColor: "#ccc",
                width: "36px",
                height: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "2px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.error.main,
                  fontSize: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                - {item.discount} %
              </Typography>
            </Box>
          )}
        </Box>
        {item.countInStock > 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            <>{"Count_in_stock"}</> <b>{item.countInStock}</b> <>{"Product"}</>
          </Typography>
        ) : (
          <Box
            sx={{
              backgroundColor: "#ccc",
              width: "60px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "2px",
              my: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.error.main,
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              Hết hàng
            </Typography>
          </Box>
        )}

        {item.sold ? (
          <Typography variant="body2" color="text.secondary">
            <>{"Sold_product"}</> <b>{item.sold}</b> <>{"Product"}</>
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {"No_sell_product"}
          </Typography>
        )}
        {(item?.location?.name || item.views) && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: "10px", mt: 2 }}
          >
            {item?.location?.name && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {item?.location?.name}
                </Typography>
              </Box>
            )}
            {item?.views && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {item?.views}
                </Typography>
              </Box>
            )}
            {!!item?.uniqueViews?.length && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {item?.uniqueViews?.length}
                </Typography>
              </Box>
            )}
            {!!item?.likedBy?.length && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {item?.likedBy?.length}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!!item.averageRating ? (
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Rating
                  name="read-only"
                  sx={{ fontSize: "16px" }}
                  defaultValue={item?.averageRating}
                  precision={0.5}
                  readOnly
                />
              </Typography>
            ) : (
              <Rating
                name="read-only"
                sx={{ fontSize: "16px" }}
                defaultValue={0}
                precision={0.5}
                readOnly
              />
            )}
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              {!!item.totalReviews ? (
                <b>{item.totalReviews}</b>
              ) : (
                <span>{"not_review"}</span>
              )}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 12px 10px",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          sx={{
            height: 40,
            display: "flex",
            alignItems: "center",
            gap: "2px",
            fontWeight: "bold",
          }}
          disabled={item.countInStock < 1}
          onClick={() => handleUpdateProductToCart(item)}
        >
          {"Add_to_cart"}
        </Button>
        <Button
          fullWidth
          variant="contained"
          sx={{
            height: 40,
            display: "flex",
            alignItems: "center",
            gap: "2px",
            fontWeight: "bold",
          }}
          disabled={item.countInStock < 1}
          onClick={() => handleBuyProductToCart(item)}
        >
          {"Buy_now"}
        </Button>
      </Box>
    </StyleCard>
  );
};

export default CardProduct;
