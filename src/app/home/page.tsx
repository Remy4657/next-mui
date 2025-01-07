import { Metadata } from "next";
import Head from "next/head";
import { ReactNode } from "react";
import { getAllProductsPublic } from "src/services/product";
import { getAllProductTypes } from "src/services/product-type";

// ** Pages
import HomeView from "src/views/home/page";

interface TOptions {
  label: string;
  value: string;
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
        limit,
        page,
        order,
        productType: "",
      },
    };
  };
}

export const metadata: Metadata = {
  title: "Lập trình thật dễ - Danh sách sản phẩm",
  description:
    "Bán hàng điện tử, điện thoại, máy tính bảng, khóa học nextjs 14 reactjs typescript pro 2024 by Lập trình thật dễ - Xây dựng website bán hàng",
  keywords: `Lập trình thật dễ - ReactJS, NextJS 14, Typescript, Lập trình thật dễ`,
  openGraph: {
    title: "Lập trình thật dễ - Danh sách sản phẩm",
    description:
      "Bán hàng điện tử, điện thoại, máy tính bảng, khóa học nextjs 14 reactjs typescript pro 2024 by Lập trình thật dễ - Xây dựng website bán hàng",
    type: "website",
    url: `https://convert-app-router.vercel.app/home`,
  },
  twitter: {
    title: "Lập trình thật dễ - Danh sách sản phẩm",
    description:
      "Bán hàng điện tử, điện thoại, máy tính bảng, khóa học nextjs 14 reactjs typescript pro 2024 by Lập trình thật dễ - Xây dựng website bán hàng",
  },
};

export default async function Home() {
  const { products, totalCount, params, productTypes } = await getProductData();

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
