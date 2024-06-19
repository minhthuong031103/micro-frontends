import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './components/ui/breadcrumb';
import { Input } from './components/ui/input';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { axiosClient } from './lib/axios';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
import { Textarea } from './components/ui/textarea';
import { ScrollArea } from './components/ui/scroll-area';
import { FileDialog, FileWithPreview } from './components/image-upload';
import toast from 'react-hot-toast';
import { Zoom } from './components/zoom-image';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AuthContext } from 'app_shell/AuthContext';
export interface IProduct {
  productId: string;
  productName: string;
  price: number;
  description: string;
  quantity: number;
  sold: number;
  imageUrl: string;

  createdAt: string;
}
import { Link } from 'react-router-dom';
export default function ProductPage() {
  const { user, jwt } = useContext(AuthContext);

  console.log('🚀 ~ ProductPage ~ user:', user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const closeRef = useRef();
  const onSubmit = async () => {
    try {
      const formData = new FormData();
      if (!name || !price || !quantity || !description || !files.length) {
        toast.error('Please fill all fields');
        return;
      }
      setIsSubmitting(true);

      files.forEach((file) => {
        formData.append('file', file);
      });
      const res = await axiosClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = {
        productName: name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        sold: 0,
        description: description,
        imageUrl: res.data?.url,
      };
      const response = await axiosClient.post('/api/product', data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log('🚀 ~ onSubmit ~ response:', response);
      setIsSubmitting(false);
      toast.success('Product added successfully');
      setRefetch((prev) => prev + 1);
      setName('');
      setPrice('');
      setQuantity('');
      setDescription('');
      setFiles([]);
      closeRef.current.click();
    } catch (e) {
      console.log(e);
    }
  };

  const [products, setProducts] = useState<Array<IProduct>>([]);
  const [refetch, setRefetch] = useState(0);
  console.log('🚀 ~ Product ~ products:', products);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState('');

  const sortedProducts: IProduct[] = useMemo(() => {
    return products.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() ||
        0 - new Date(a.createdAt).getTime() ||
        0
    );
  }, [products]);
  console.log(
    '🚀 ~ constsortedProducts:IProduct[]=useMemo ~ sortedProducts:',
    sortedProducts
  );

  const filteredProducts: IProduct[] = useMemo(() => {
    return sortedProducts?.filter((product: IProduct) => {
      return product.productName.toLowerCase().includes(search.toLowerCase());
    });
  }, [sortedProducts, search]);

  const paginatedProducts: IProduct[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const fetchProducts = async () => {
    if (!refetch) {
      setLoading(true);
      setSearch('');
    }
    try {
      const response = await axiosClient.get('/api/products');
      console.log('🚀 ~ fetchProducts ~ response:', response);
      setProducts(response.data?.products);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refetch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 ">
      <header className="sticky top-0 z-30 flex h-14 justify-between items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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
                <a href="#">Products</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>All Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
        <div className="relative ml-auto flex">
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
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {/* <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger> */}
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
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
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>Add Product</DialogTitle>
                  <DialogDescription>Add new product</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]  ">
                  <div className="flex mx-3 flex-col gap-y-3">
                    <div className="flex flex-col gap-y-3">
                      <div>
                        <FileDialog
                          name="Image product"
                          files={files}
                          setFiles={setFiles}
                        />
                      </div>
                      <Input
                        label="Product Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Product Name"
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <Input
                        label="Price"
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter Price"
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <Input
                        label="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        type="text"
                        placeholder="Enter Quantity"
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        label="Product Description"
                        placeholder="Enter Description"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 px-3 py-2">
                    <Button
                      disabled={isSubmitting}
                      onClick={onSubmit}
                      className="bg-primary text-primary-foreground"
                    >
                      Save
                    </Button>
                    <Button variant={'outline'}>Cancel</Button>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all">
          {user?.name}
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className=" w-[100px] sm:table-cell">
                      <span className="">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className=" md:table-cell">Price</TableHead>
                    <TableHead className=" md:table-cell">Sold </TableHead>
                    <TableHead className=" md:table-cell">
                      Description
                    </TableHead>
                    <TableHead className=" md:table-cell">Created at</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts?.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell className=" sm:table-cell">
                        <Zoom>
                          <img
                            alt="Product image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.imageUrl}
                            width="64"
                          />
                        </Zoom>
                      </TableCell>
                      <a href={`/products/${product.productId}`}>
                        <TableCell className="hover:underline font-bold">
                          {product.productName}
                        </TableCell>
                      </a>

                      <TableCell>
                        <Badge variant="outline">{product.quantity}</Badge>
                      </TableCell>
                      <TableCell className=" md:table-cell">
                        ${product.price}
                      </TableCell>
                      <TableCell className=" md:table-cell">
                        {product.sold}
                      </TableCell>
                      <TableCell className=" md:table-cell">
                        {product.description}
                      </TableCell>
                      <TableCell className=" md:table-cell">
                        {product.createdAt}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{filteredProducts?.length}</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
