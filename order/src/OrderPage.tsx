import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from 'app_shell/AuthContext';
import { axiosClient } from './lib/axios';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { ScrollArea } from './components/ui/scroll-area';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './components/ui/select';
import toast from 'react-hot-toast';

export interface OrderProps {
  orderId: string;
  customerId: string;
  totalPrice: number;
  status: string;
  orderDate: string;
}

export default function OrderPage() {
  const { user, jwt } = useContext(AuthContext);
  const [refetch, setRefetch] = useState(0);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  console.log('🚀 ~ OrderPage ~ orders:', orders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedOrders: OrderProps[] = useMemo(() => {
    return orders?.sort((a, b) => {
      return (
        new Date(b.orderDate).getTime() ||
        0 - new Date(a.orderDate).getTime() ||
        0
      );
    });
  }, [orders]);

  const filteredOrders: OrderProps[] = useMemo(() => {
    return sortedOrders.filter((order) => {
      return order.customerId.toLowerCase().includes(search.toLowerCase()) &&
        user?.role === 'admin'
        ? true
        : order.customerId == user?.customer_id;
    });
  }, [search, sortedOrders]);
const [allProducts, setAllProducts] = useState([])

const [products, setProducts] = useState([
 
]);
  
  const fetchProducts = async () => {
  
    try {
      const response = await axiosClient.get('/api/products');
      console.log('🚀 ~ fetchProducts ~ response:', response);
      setAllProducts(response.data?.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("🚀 ~ OrderPage ~ products:", products)
    fetchProducts();
  }
  , [refetch]);

  const [newProduct, setNewProduct] = useState({
    id: 0,
    name: '',
    price: 0,
    quantity: 1,
  });
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0

      && !products.find((product) => product.id === newProduct.id)
    ) {
      setProducts([...products, newProduct]);
      setNewProduct({id:0, name: '', price: 0, quantity: 1 });
    }
    else if (
      products.find((product) => product.id === newProduct.id)
    ) {
      setProducts(
        products.map((product) =>
          product.id === newProduct.id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    
    }
  };
  const handleQuantityChange = (id, quantity) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, quantity } : product
      )
    );
  };
  const handleRemoveProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };
  const totalOrderValue = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const paginatedOrders: OrderProps[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [currentPage, filteredOrders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const fetchOrders = async () => {
    if (!refetch) {
      setLoading(true);
      setSearch('');
    }
    try {
      const response = await axiosClient('/api/orders', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setOrders(response.data?.orders);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

const closeRef = React.useRef(null);

  useEffect(() => {
    fetchOrders();
  }, [refetch]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        {/* <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="#">Dashboard</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="#">Orders</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Recent Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Your Orders</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Introducing Our Dynamic Orders Dashboard for Seamless
                  Management and Insightful Analysis.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogClose ref={closeRef} />
                  <DialogContent className="w-[90%]">
                    <DialogHeader>
                      <DialogTitle>Add Product</DialogTitle>
                      <DialogDescription>Add new product</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]  ">
                      <div className="flex mx-3 flex-col gap-y-3">
                        <section className="w-full py-12">
                          <div className="container grid gap-6 md:gap-8 px-4 md:px-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                              <div className="grid gap-1">
                                <h1 className="text-2xl font-bold tracking-tight">
                                  Order Summary
                                </h1>
                                <p className="text-muted-foreground">
                                  Review and manage your order details.
                                </p>
                              </div>
                            </div>
                            <div className="grid gap-8">
                              <div className="grid gap-4">
                                <div className="grid gap-2">
                                  <div className="flex items-center gap-4">
                                    <Select onValueChange={(value) => {
                                      const product = allProducts.find(
                                        (product) => product.productId === value
                                      );
                                      if(product)
                                         setNewProduct({
                                           id: product.productId,
                                           name: product.productName,
                                           price: product.price,
                                           quantity: 0,
                                         });
                                    }}>
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a fruit" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Products</SelectLabel>
                                          {allProducts.map((product) => (
                                            <SelectItem
                                              value={product.productId}
                                              key={product.productId}
                                          
                                            >
                                              {product.productName}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>

                                    <Button onClick={handleAddProduct}>
                                      Add
                                    </Button>
                                  </div>
                                </div>
                                <div className="grid gap-4">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead />
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {products.map((product) => (
                                        <TableRow key={product.id}>
                                          <TableCell className="font-medium">
                                            {product.name}
                                          </TableCell>
                                          <TableCell>
                                            ${product.price.toFixed(2)}
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-2">
                                              <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                  handleQuantityChange(
                                                    product.id,
                                                    product.quantity - 1
                                                  )
                                                }
                                                disabled={product.quantity <= 1}
                                              >
                                                <MinusIcon className="w-4 h-4" />
                                              </Button>
                                              <span>{product.quantity}</span>
                                              <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                  handleQuantityChange(
                                                    product.id,
                                                    product.quantity + 1
                                                  )
                                                }
                                              >
                                                <PlusIcon className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            $
                                            {(
                                              product.price * product.quantity
                                            ).toFixed(2)}
                                          </TableCell>
                                          <TableCell>
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              onClick={() =>
                                                handleRemoveProduct(product.id)
                                              }
                                            >
                                              <TrashIcon className="w-4 h-4" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                  Total: ${totalOrderValue.toFixed(2)}
                                </div>
                                <Button
                                
                                  onClick={async () => {
                                    const data = {
                                      customerId: user?.customer_id,
                                      items: 
                                     products?.map((product) => ({
                                          
                                            productId: product.id,
                                            quantity: product.quantity,
                                          
                                        })),
                                      
                                    }
                                    

                                    const res =await axiosClient.post('/api/orders', data)
                                    if (res?.data?.status) {
                                      toast.success('Order placed successfully')
                                    }

fetchOrders();
                                  }}
                                  size="lg">Place Order</Button>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                      <div className="flex justify-end gap-2 px-3 py-2">
                        {/* <Button
                          disabled={isSubmitting}
                          onClick={onSubmit}
                          className="bg-primary text-primary-foreground"
                        >
                          Save
                        </Button> */}
                        <Button variant={'outline'}>Cancel</Button>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>{' '}
              </CardFooter>
            </Card>
          </div>
          <div className="flex items-center"></div>
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Orders</CardTitle>
              <CardDescription>Recent orders from your store.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => {
                    return (
                      <TableRow key={order.orderId}>
                        <TableCell>
                          <div className="font-medium">{order.customerId}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {order.customerId}
                          </div>
                        </TableCell>

                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {order.orderDate}
                        </TableCell>
                        <TableCell className="text-right">
                          ${order.totalPrice}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function MinusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
