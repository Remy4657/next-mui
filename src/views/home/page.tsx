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
import { getAllCities } from 'src/services/city'

// ** component
import CardProduct from "src/component/product/CardProduct";
import NoData from "src/component/no-data";
import Spinner from "src/component/spinner";
import CardSkeleton from "src/component/product/CardSkeleton";
import FilterProduct from 'src/component/product/FilterProduct'


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
    const isFirstRender = useRef<boolean>(false);
    // ** Translate
    const { t } = useTranslation()
    // ** Props
    const { products, totalCount, paramsServer, productTypesServer } = props;

    const [sortBy, setSortBy] = useState("createdAt desc");
    const [searchBy, setSearchBy] = useState("");
    const [productTypeSelected, setProductTypeSelected] = useState('')
    const [reviewSelected, setReviewSelected] = useState('')
    const [locationSelected, setLocationSelected] = useState('')
    const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

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

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setProductTypeSelected(newValue)
    }
    const handleResetFilter = () => {
        setLocationSelected('')
        setReviewSelected('')
    }
    const handleFilterProduct = (value: string, type: string) => {
        switch (type) {
            case 'review': {
                setReviewSelected(value)

                break
            }
            case 'location': {
                setLocationSelected(value)

                break
            }
        }
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
    const fetchAllCities = async () => {
        setLoading(true)
        await getAllCities({ params: { limit: -1, page: -1 } })
            .then(res => {
                const data = res?.data.cities
                if (data) {
                    setOptionCities(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
                }
                setLoading(false)
            })
            .catch(e => {
                setLoading(false)
            })
    }
    //React.useEffect(() => {
    // if (isFirstRender.current) {

    //     handleGetListProducts();
    // }
    //}, []);
    React.useEffect(() => {
        // if (isFirstRender.current) {
        //     setProductsPublic({ data: products, total: totalCount });
        // }
        setOptionTypes(productTypesServer);
        if (paramsServer.productType) {
            setProductTypeSelected(paramsServer.productType)
        }

    }, []);
    React.useEffect(() => {
        fetchAllCities()
        if (isFirstRender.current) {
            handleGetListProducts()
        }

    }, [sortBy, searchBy, page, pageSize, filterBy])
    React.useEffect(() => {
        console.log("productTypeSelected: ", productTypeSelected)
        setFilterBy({ productType: productTypeSelected, minStar: reviewSelected, productLocation: locationSelected })
        isFirstRender.current = true
    }, [productTypeSelected, reviewSelected, locationSelected])

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
                            <Box sx={{ width: '100%' }}>
                                <FilterProduct
                                    locationSelected={locationSelected}
                                    reviewSelected={reviewSelected}
                                    handleReset={handleResetFilter}
                                    optionCities={optionCities}
                                    handleFilterProduct={handleFilterProduct}
                                />
                            </Box>
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
