"use client";
// ** next
import { NextPage } from "next";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Typography, useTheme, Tab, Tabs, TabsProps } from "@mui/material";

// ** react
import { useState, useRef } from "react";
import { useTranslation } from 'react-i18next'

// ** service
import { getAllProductsPublic } from "src/services/product";
// ** component
import CardProduct from "src/component/product/CardProduct";
import NoData from "src/component/no-data";
import Spinner from "src/component/spinner";
import CardSkeleton from "src/component/product/CardSkeleton";

// ** utils
import { formatFilter } from "src/utils";
import CustomSelect from 'src/component/custom-select'

// ** type 
import { TProduct } from "src/types/product";

interface TOptions {
    label: string;
    value: string;
}
type TProps = {
    products: TProduct[];
    totalCount: number;
    productTypesServer: TOptions[];
    paramsServer: {
        limit: number;
        page: number;
        order: string;
        productType: string;
    };
};

interface TProductPublicState {
    data: TProduct[];
    total: number;
}
const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
    "&.MuiTabs-root": {
        borderBottom: "none",
    },
}));

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

const HomeView: NextPage<TProps> = (props) => {
    const isServerRendered = useRef<boolean>(true);
    // ** Translate
    const { t } = useTranslation()
    // ** Props
    const { products, totalCount, paramsServer, productTypesServer } = props;

    const [sortBy, setSortBy] = useState("createdAt desc");
    const [searchBy, setSearchBy] = useState("");
    const [pageSize, setPageSize] = useState(20);
    const [page, setPage] = useState(1);
    const [optionTypes, setOptionTypes] = useState<
        { label: string; value: string }[]
    >([]);
    const [productTypeSelected, setProductTypeSelected] = useState('')

    const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>(
        {}
    );
    const [loading, setLoading] = useState(true);
    const [productsPublic, setProductsPublic] = useState<TProductPublicState>({
        data: [],
        total: 0,
    });

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setProductTypeSelected(newValue)
    }
    // fetch api
    const handleGetListProducts = async () => {
        setLoading(true);
        const query = {
            params: {
                limit: pageSize,
                page: page,
                search: searchBy,
                order: sortBy,
                ...formatFilter(filterBy)
            },
        };
        await getAllProductsPublic(query).then((res) => {
            if (res?.data) {
                setLoading(false);
                setProductsPublic({
                    data: res?.data?.products,
                    total: res?.data?.totalCount,
                });
            }
        });
    };
    React.useEffect(() => {
        handleGetListProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, searchBy, page, pageSize, filterBy])
    React.useEffect(() => {
        if (isServerRendered.current) {
            setFilterBy({ productType: productTypeSelected })
        }
    }, [productTypeSelected])

    React.useEffect(() => {
        if (!isServerRendered.current) {
            handleGetListProducts();

        }
    }, []);
    React.useEffect(() => {
        if (isServerRendered.current) {
            setProductsPublic({ data: products, total: totalCount });
            setOptionTypes(productTypesServer);
            if (paramsServer.productType) {
                setProductTypeSelected(paramsServer.productType)
            }
        }
        setLoading(false);
    }, []);

    return (
        <>
            {loading && <Spinner />}
            <Container maxWidth="xl">
                <Box sx={{ flexGrow: 1, marginTop: 10 }}>
                    <StyledTabs value={productTypeSelected} onChange={handleChange} aria-label="wrapped label tabs example">
                        {optionTypes.map((opt) => {
                            return (
                                <Tab key={opt.value} value={opt.value} label={opt.label} />
                            );
                        })}
                    </StyledTabs>

                    <Grid container spacing={2} sx={{ width: "100%" }}>
                        <Grid item xs={3} sx={{ paddingLeft: "0px !important" }}>
                            <Item>xs=4</Item>
                        </Grid>
                        <Grid container item xs={9}>
                            <Box sx={{ width: "100%", display: "flex", justifyContent: 'flex-end' }}>
                                <Box sx={{}} >
                                    <CustomSelect
                                        fullWidth
                                        onChange={e => {
                                            setSortBy(e.target.value as string)
                                        }}
                                        value={sortBy}
                                        options={[
                                            {
                                                label: t('Sort best sold'),
                                                value: 'sold desc'
                                            },
                                            {
                                                label: t('Sort new create'),
                                                value: 'createdAt desc'
                                            },
                                            {
                                                label: t('Sort high view'),
                                                value: 'views desc'
                                            },
                                            {
                                                label: t('Sort high like'),
                                                value: 'totalLikes desc'
                                            }
                                        ]}
                                        placeholder={t('Sort_by')}
                                        sx={{ padding: "0 20px" }}
                                    />
                                </Box>
                            </Box>

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
};
export default HomeView;
