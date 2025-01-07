"use client";
// ** next
import { NextPage } from 'next'

import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
// ** react
import { useState, useRef } from "react";
// ** service
import { getAllProductsPublic } from "src/services/product";
// ** component
import CardProduct from "src/component/product/CardProduct";
import NoData from "src/component/no-data";
import Spinner from "src/component/spinner";
import CardSkeleton from "src/component/product/CardSkeleton";

// ** utils
import { TProduct } from 'src/types/product'


interface TOptions {
    label: string
    value: string
}
type TProps = {
    products: TProduct[]
    totalCount: number
    productTypesServer: TOptions[]
    paramsServer: {
        limit: number
        page: number
        order: string
        productType: string
    }
}

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

const HomeView: NextPage<TProps> = props => {
    const isServerRendered = useRef<boolean>(true)
    // ** Props
    const { products, totalCount, paramsServer, productTypesServer } = props
    console.log("product: ", products)


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
    const [loading, setLoading] = useState(true);
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
        if (!isServerRendered.current) {

            handleGetListProducts();
        }

    }, []);
    React.useEffect(() => {
        if (isServerRendered.current) {
            setProductsPublic({ data: products, total: totalCount })

        }
        setLoading(false);
        isServerRendered.current = false
    }, []);

    return (
        <>
            {loading && <Spinner />}
            <Container maxWidth="xl">
                <Box sx={{ flexGrow: 1, marginTop: 10 }}>
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                        <Grid item xs={3} sx={{ paddingLeft: "0px !important" }}>
                            <Item>xs=4</Item>
                        </Grid>
                        <Grid container item xs={9}>
                            {loading ? (
                                <Grid
                                    container
                                    spacing={{
                                        md: 6,
                                        xs: 4,
                                    }}
                                >
                                    {Array.from({ length: 6 }).map((_, index) => {
                                        return (
                                            <Grid item key={index} md={4} sm={6} xs={12}>
                                                <CardSkeleton />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <Grid
                                    container
                                    spacing={{
                                        md: 6,
                                        xs: 4,
                                    }}
                                >
                                    {productsPublic?.data?.length > 0 ? (
                                        <>
                                            {productsPublic?.data?.map((item: TProduct) => {
                                                return (
                                                    <Grid item key={item._id} md={4} sm={6} xs={12}>
                                                        <CardProduct item={item} />
                                                    </Grid>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <Box sx={{ width: "100%", mt: 10 }}>
                                            <NoData
                                                widthImage="60px"
                                                heightImage="60px"
                                                textNodata={"No product"}
                                            />
                                        </Box>
                                    )}
                                </Grid>
                            )}
                            <Box mt={6}></Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
export default HomeView
