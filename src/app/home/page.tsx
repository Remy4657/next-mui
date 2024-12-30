"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
// ** react
import { useState } from "react";
// ** type
import { TProduct } from "../../types/product";
// ** service
import { getAllProductsPublic } from "src/services/product";
// ** component
import CardProduct from "src/component/product/CardProduct";
import NoData from "src/component/no-data";

interface TProductPublicState {
  data: TProduct[];
  total: number;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function BasicGrid() {
  const [sortBy, setSortBy] = useState("createdAt desc");
  const [searchBy, setSearchBy] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [optionTypes, setOptionTypes] = useState<
    { label: string; value: string }[]
  >([]);
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [productsPublic, setProductsPublic] = useState<TProductPublicState>({
    data: [],
    total: 0,
  });
  // fetch api
  const handleGetListProducts = async () => {
    setLoading(true);
    const query = {
      params: {
        limit: pageSize,
        page: page,
        search: searchBy,
        order: sortBy,
      },
    };
    await getAllProductsPublic(query).then((res) => {
      if (res?.data) {
        console.log("res: ", res);
        setLoading(false);
        setProductsPublic({
          data: res?.data?.products,
          total: res?.data?.totalCount,
        });
      }
    });
  };
  React.useEffect(() => {
    handleGetListProducts();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1, marginTop: 10 }}>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid item xs={3} sx={{ paddingLeft: "0px !important" }}>
            <Item>xs=4</Item>
          </Grid>
          <Grid container item xs={9}>
            {productsPublic?.data?.length > 0 ? (
              <>
                {productsPublic?.data?.map((item: TProduct) => {
                  return (
                    <Grid item key={item._id} md={3} sm={3} xs={3}>
                      <Item>
                        <CardProduct item={item} />
                      </Item>
                    </Grid>
                  );
                })}
              </>
            ) : (
              <Box sx={{ width: "100%", mt: 10 }}>
                <NoData
                  widthImage="60px"
                  heightImage="60px"
                  textNodata={"No_product"}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
