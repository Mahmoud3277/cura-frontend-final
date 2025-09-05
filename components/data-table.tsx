'use client';

import * as React from 'react';
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    CheckCircle2Icon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ColumnsIcon,
    GripVerticalIcon,
    LoaderIcon,
    MoreVerticalIcon,
    PlusIcon,
    TrendingUpIcon,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';
import { z } from 'zod';

import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const schema = z.object({
    id: z.number(),
    header: z.string(),
    type: z.string(),
    status: z.string(),
    target: z.string(),
    limit: z.string(),
    reviewer: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({
        id,
    });

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-transparent"
            data-oid="kxjea-s"
        >
            <GripVerticalIcon className="size-3 text-muted-foreground" data-oid="_mvekf3" />
            <span className="sr-only" data-oid="xh76hi1">
                Drag to reorder
            </span>
        </Button>
    );
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} data-oid="w0sag_1" />,
    },
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex items-center justify-center" data-oid="ymyouir">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    data-oid="9:0:j27"
                />
            </div>
        ),

        cell: ({ row }) => (
            <div className="flex items-center justify-center" data-oid="3gkz5bv">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    data-oid="2ds:tql"
                />
            </div>
        ),

        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'header',
        header: 'Header',
        cell: ({ row }) => {
            return <TableCellViewer item={row.original} data-oid="0ydbu4d" />;
        },
        enableHiding: false,
    },
    {
        accessorKey: 'type',
        header: 'Section Type',
        cell: ({ row }) => (
            <div className="w-32" data-oid="x_kiyfc">
                <Badge
                    variant="outline"
                    className="px-1.5 text-muted-foreground"
                    data-oid="neoui6v"
                >
                    {row.original.type}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                data-oid="37by3:7"
            >
                {row.original.status === 'Done' ? (
                    <CheckCircle2Icon
                        className="text-green-500 dark:text-green-400"
                        data-oid="h5lh41i"
                    />
                ) : (
                    <LoaderIcon data-oid="11l38g7" />
                )}
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: 'target',
        header: () => (
            <div className="w-full text-right" data-oid="xczh07h">
                Target
            </div>
        ),

        cell: ({ row }) => (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
                        loading: `Saving ${row.original.header}`,
                        success: 'Done',
                        error: 'Error',
                    });
                }}
                data-oid="-i2c4bf"
            >
                <Label htmlFor={`${row.original.id}-target`} className="sr-only" data-oid="62rqe18">
                    Target
                </Label>
                <Input
                    className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
                    defaultValue={row.original.target}
                    id={`${row.original.id}-target`}
                    data-oid="m03y2pv"
                />
            </form>
        ),
    },
    {
        accessorKey: 'limit',
        header: () => (
            <div className="w-full text-right" data-oid="1ia_6yf">
                Limit
            </div>
        ),

        cell: ({ row }) => (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
                        loading: `Saving ${row.original.header}`,
                        success: 'Done',
                        error: 'Error',
                    });
                }}
                data-oid="duv-yz8"
            >
                <Label htmlFor={`${row.original.id}-limit`} className="sr-only" data-oid="8jxry2s">
                    Limit
                </Label>
                <Input
                    className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
                    defaultValue={row.original.limit}
                    id={`${row.original.id}-limit`}
                    data-oid="5yxx06l"
                />
            </form>
        ),
    },
    {
        accessorKey: 'reviewer',
        header: 'Reviewer',
        cell: ({ row }) => {
            const isAssigned = row.original.reviewer !== 'Assign reviewer';

            if (isAssigned) {
                return row.original.reviewer;
            }

            return (
                <>
                    <Label
                        htmlFor={`${row.original.id}-reviewer`}
                        className="sr-only"
                        data-oid="-lbmya8"
                    >
                        Reviewer
                    </Label>
                    <Select data-oid="hzbcg5e">
                        <SelectTrigger
                            className="h-8 w-40"
                            id={`${row.original.id}-reviewer`}
                            data-oid="m..zz6_"
                        >
                            <SelectValue placeholder="Assign reviewer" data-oid=":-hpz1y" />
                        </SelectTrigger>
                        <SelectContent align="end" data-oid=".qf3nq5">
                            <SelectItem value="Eddie Lake" data-oid="0s4kez5">
                                Eddie Lake
                            </SelectItem>
                            <SelectItem value="Jamik Tashpulatov" data-oid="nq1cnfr">
                                Jamik Tashpulatov
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </>
            );
        },
    },
    {
        id: 'actions',
        cell: () => (
            <DropdownMenu data-oid="86h4:bx">
                <DropdownMenuTrigger asChild data-oid="3ygj.8q">
                    <Button
                        variant="ghost"
                        className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                        size="icon"
                        data-oid="zj:bard"
                    >
                        <MoreVerticalIcon data-oid="c6cth6i" />
                        <span className="sr-only" data-oid="ijq:2fd">
                            Open menu
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32" data-oid="91yekr5">
                    <DropdownMenuItem data-oid="q.04sqx">Edit</DropdownMenuItem>
                    <DropdownMenuItem data-oid="kngvz13">Make a copy</DropdownMenuItem>
                    <DropdownMenuItem data-oid="ved:z_z">Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator data-oid="3yjihjf" />
                    <DropdownMenuItem data-oid="xhbwbgf">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            data-state={row.getIsSelected() && 'selected'}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
            data-oid="pf1ca75"
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} data-oid="j-rmfzp">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
    const [data, setData] = React.useState(() => initialData);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const sortableId = React.useId();
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {}),
    );

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({ id }) => id) || [],
        [data],
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }
    }

    return (
        <Tabs
            defaultValue="outline"
            className="flex w-full flex-col justify-start gap-6"
            data-oid="y97i1qk"
        >
            <div className="flex items-center justify-between px-4 lg:px-6" data-oid="b.c3xos">
                <Label htmlFor="view-selector" className="sr-only" data-oid="mk49e54">
                    View
                </Label>
                <Select defaultValue="outline" data-oid="-d1l4lq">
                    <SelectTrigger
                        className="@4xl/main:hidden flex w-fit"
                        id="view-selector"
                        data-oid="5fzdmgp"
                    >
                        <SelectValue placeholder="Select a view" data-oid="gfqrg1c" />
                    </SelectTrigger>
                    <SelectContent data-oid="o2cyipd">
                        <SelectItem value="outline" data-oid="qmc35y.">
                            Outline
                        </SelectItem>
                        <SelectItem value="past-performance" data-oid="4d5cuqz">
                            Past Performance
                        </SelectItem>
                        <SelectItem value="key-personnel" data-oid="8wb4gw6">
                            Key Personnel
                        </SelectItem>
                        <SelectItem value="focus-documents" data-oid="x._8lw8">
                            Focus Documents
                        </SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="@4xl/main:flex hidden" data-oid=".6p9:kc">
                    <TabsTrigger value="outline" data-oid="dh8pd63">
                        Outline
                    </TabsTrigger>
                    <TabsTrigger value="past-performance" className="gap-1" data-oid="riym_8j">
                        Past Performance{' '}
                        <Badge
                            variant="secondary"
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
                            data-oid="qgxof-5"
                        >
                            3
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="key-personnel" className="gap-1" data-oid="bwshy5b">
                        Key Personnel{' '}
                        <Badge
                            variant="secondary"
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
                            data-oid="mtn51:1"
                        >
                            2
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="focus-documents" data-oid="oz0.1lj">
                        Focus Documents
                    </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2" data-oid="h5w9f28">
                    <DropdownMenu data-oid="z70v7k.">
                        <DropdownMenuTrigger asChild data-oid="ka.55lc">
                            <Button variant="outline" size="sm" data-oid="8bqh8r.">
                                <ColumnsIcon data-oid=".7f9.kx" />
                                <span className="hidden lg:inline" data-oid="tgi.azx">
                                    Customize Columns
                                </span>
                                <span className="lg:hidden" data-oid="wg31bqf">
                                    Columns
                                </span>
                                <ChevronDownIcon data-oid="o-bpvyp" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56" data-oid=".0ou61z">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== 'undefined' &&
                                        column.getCanHide(),
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                            data-oid="7sm3ba6"
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" data-oid="i20ykh0">
                        <PlusIcon data-oid="929ag6:" />
                        <span className="hidden lg:inline" data-oid="bw_sm50">
                            Add Section
                        </span>
                    </Button>
                </div>
            </div>
            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
                data-oid="igsss.k"
            >
                <div className="overflow-hidden rounded-lg border" data-oid="trgnkf8">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                        data-oid="1wbe_vd"
                    >
                        <Table data-oid="5-0vp37">
                            <TableHeader className="sticky top-0 z-10 bg-muted" data-oid="59jof4v">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} data-oid="s4s7am4">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    data-oid="0s__0o-"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext(),
                                                          )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody
                                className="**:data-[slot=table-cell]:first:w-8"
                                data-oid="8zxjo_t"
                            >
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                        data-oid="m3weemn"
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow
                                                key={row.id}
                                                row={row}
                                                data-oid="1.zxkt8"
                                            />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow data-oid="y:tvfwg">
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                            data-oid="4w-k09r"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4" data-oid="7z17bvj">
                    <div
                        className="hidden flex-1 text-sm text-muted-foreground lg:flex"
                        data-oid="mynlcz1"
                    >
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit" data-oid="ec_32iy">
                        <div className="hidden items-center gap-2 lg:flex" data-oid="eug-s5z">
                            <Label
                                htmlFor="rows-per-page"
                                className="text-sm font-medium"
                                data-oid="lnt887s"
                            >
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                                data-oid="my9-voi"
                            >
                                <SelectTrigger
                                    className="w-20"
                                    id="rows-per-page"
                                    data-oid="hn:zpa4"
                                >
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                        data-oid="-_fly8d"
                                    />
                                </SelectTrigger>
                                <SelectContent side="top" data-oid=":bwb_v:">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem
                                            key={pageSize}
                                            value={`${pageSize}`}
                                            data-oid="10_tx:p"
                                        >
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div
                            className="flex w-fit items-center justify-center text-sm font-medium"
                            data-oid="n2c6e5r"
                        >
                            Page {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0" data-oid="kp4e7a6">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                data-oid="5r:hux2"
                            >
                                <span className="sr-only" data-oid="grjp8jn">
                                    Go to first page
                                </span>
                                <ChevronsLeftIcon data-oid="icfqmnc" />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                data-oid="of27b.g"
                            >
                                <span className="sr-only" data-oid="lkl3a8p">
                                    Go to previous page
                                </span>
                                <ChevronLeftIcon data-oid="phhd12_" />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                data-oid="8ky.o20"
                            >
                                <span className="sr-only" data-oid="z30imij">
                                    Go to next page
                                </span>
                                <ChevronRightIcon data-oid="nqmcntq" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                                data-oid="6yin77g"
                            >
                                <span className="sr-only" data-oid="9dx32p0">
                                    Go to last page
                                </span>
                                <ChevronsRightIcon data-oid="9-bfw4-" />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent
                value="past-performance"
                className="flex flex-col px-4 lg:px-6"
                data-oid="_cqujuq"
            >
                <div
                    className="aspect-video w-full flex-1 rounded-lg border border-dashed"
                    data-oid="ah9yy:9"
                ></div>
            </TabsContent>
            <TabsContent
                value="key-personnel"
                className="flex flex-col px-4 lg:px-6"
                data-oid="232efi9"
            >
                <div
                    className="aspect-video w-full flex-1 rounded-lg border border-dashed"
                    data-oid="ogkm-xh"
                ></div>
            </TabsContent>
            <TabsContent
                value="focus-documents"
                className="flex flex-col px-4 lg:px-6"
                data-oid="l4g3k8r"
            >
                <div
                    className="aspect-video w-full flex-1 rounded-lg border border-dashed"
                    data-oid="pf9.me8"
                ></div>
            </TabsContent>
        </Tabs>
    );
}

const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'var(--primary)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
    const isMobile = useIsMobile();

    return (
        <Sheet data-oid="wo:11x3">
            <SheetTrigger asChild data-oid=".5o231q">
                <Button
                    variant="link"
                    className="w-fit px-0 text-left text-foreground"
                    data-oid="dh29n38"
                >
                    {item.header}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col" data-oid="9mqbi.b">
                <SheetHeader className="gap-1" data-oid="-cahmli">
                    <SheetTitle data-oid="eo9:bww">{item.header}</SheetTitle>
                    <SheetDescription data-oid="l0vlmhj">
                        Showing total visitors for the last 6 months
                    </SheetDescription>
                </SheetHeader>
                <div
                    className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm"
                    data-oid="lqvt93z"
                >
                    {!isMobile && (
                        <>
                            <ChartContainer config={chartConfig} data-oid="ee0rxbg">
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 0,
                                        right: 10,
                                    }}
                                    data-oid="wf681iy"
                                >
                                    <CartesianGrid vertical={false} data-oid="1u1ud7s" />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        hide
                                        data-oid="3hie_1f"
                                    />

                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                indicator="dot"
                                                data-oid="6x:yblt"
                                            />
                                        }
                                        data-oid="kg.-nde"
                                    />

                                    <Area
                                        dataKey="mobile"
                                        type="natural"
                                        fill="var(--color-mobile)"
                                        fillOpacity={0.6}
                                        stroke="var(--color-mobile)"
                                        stackId="a"
                                        data-oid="f5y5bu."
                                    />

                                    <Area
                                        dataKey="desktop"
                                        type="natural"
                                        fill="var(--color-desktop)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-desktop)"
                                        stackId="a"
                                        data-oid="u9fm2p8"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <Separator data-oid="e6q9.y8" />
                            <div className="grid gap-2" data-oid="fkjeqhz">
                                <div
                                    className="flex gap-2 font-medium leading-none"
                                    data-oid="_5.gla0"
                                >
                                    Trending up by 5.2% this month{' '}
                                    <TrendingUpIcon className="size-4" data-oid="neidshy" />
                                </div>
                                <div className="text-muted-foreground" data-oid="y68z8t_">
                                    Showing total visitors for the last 6 months. This is just some
                                    random text to test the layout. It spans multiple lines and
                                    should wrap around.
                                </div>
                            </div>
                            <Separator data-oid="zilb5x." />
                        </>
                    )}
                    <form className="flex flex-col gap-4" data-oid="798by:3">
                        <div className="flex flex-col gap-3" data-oid="tm61k8d">
                            <Label htmlFor="header" data-oid="kbmdsyx">
                                Header
                            </Label>
                            <Input id="header" defaultValue={item.header} data-oid="znk3x1u" />
                        </div>
                        <div className="grid grid-cols-2 gap-4" data-oid="s8-fezf">
                            <div className="flex flex-col gap-3" data-oid="_sdf45h">
                                <Label htmlFor="type" data-oid="h2zln27">
                                    Type
                                </Label>
                                <Select defaultValue={item.type} data-oid="z:rsbst">
                                    <SelectTrigger id="type" className="w-full" data-oid="gmnxgn2">
                                        <SelectValue
                                            placeholder="Select a type"
                                            data-oid="ko1j5wr"
                                        />
                                    </SelectTrigger>
                                    <SelectContent data-oid="qe:1f23">
                                        <SelectItem value="Table of Contents" data-oid="b:elwhv">
                                            Table of Contents
                                        </SelectItem>
                                        <SelectItem value="Executive Summary" data-oid="uf7vpxy">
                                            Executive Summary
                                        </SelectItem>
                                        <SelectItem value="Technical Approach" data-oid="277ee43">
                                            Technical Approach
                                        </SelectItem>
                                        <SelectItem value="Design" data-oid="t54j-s7">
                                            Design
                                        </SelectItem>
                                        <SelectItem value="Capabilities" data-oid="d2x1nw4">
                                            Capabilities
                                        </SelectItem>
                                        <SelectItem value="Focus Documents" data-oid="bt72-.-">
                                            Focus Documents
                                        </SelectItem>
                                        <SelectItem value="Narrative" data-oid="_o6f45_">
                                            Narrative
                                        </SelectItem>
                                        <SelectItem value="Cover Page" data-oid="a7sm-93">
                                            Cover Page
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3" data-oid="1o34h5:">
                                <Label htmlFor="status" data-oid="x976_td">
                                    Status
                                </Label>
                                <Select defaultValue={item.status} data-oid="a3lrmd0">
                                    <SelectTrigger
                                        id="status"
                                        className="w-full"
                                        data-oid="itgwl9d"
                                    >
                                        <SelectValue
                                            placeholder="Select a status"
                                            data-oid="ev7..ty"
                                        />
                                    </SelectTrigger>
                                    <SelectContent data-oid="v3pf7b:">
                                        <SelectItem value="Done" data-oid="q2j4_rl">
                                            Done
                                        </SelectItem>
                                        <SelectItem value="In Progress" data-oid="2nm3s7x">
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value="Not Started" data-oid="_o_za3c">
                                            Not Started
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4" data-oid="l_zy_ql">
                            <div className="flex flex-col gap-3" data-oid="to7b79l">
                                <Label htmlFor="target" data-oid="_.qdn8s">
                                    Target
                                </Label>
                                <Input id="target" defaultValue={item.target} data-oid="a47z-uy" />
                            </div>
                            <div className="flex flex-col gap-3" data-oid="lzkzuo-">
                                <Label htmlFor="limit" data-oid="6c26t_f">
                                    Limit
                                </Label>
                                <Input id="limit" defaultValue={item.limit} data-oid="a1dtl47" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3" data-oid="1ctny:k">
                            <Label htmlFor="reviewer" data-oid="p14lxqw">
                                Reviewer
                            </Label>
                            <Select defaultValue={item.reviewer} data-oid="9hlepnd">
                                <SelectTrigger id="reviewer" className="w-full" data-oid="1r-wq3c">
                                    <SelectValue
                                        placeholder="Select a reviewer"
                                        data-oid="ohz753d"
                                    />
                                </SelectTrigger>
                                <SelectContent data-oid="0iuz1:z">
                                    <SelectItem value="Eddie Lake" data-oid="bg--km.">
                                        Eddie Lake
                                    </SelectItem>
                                    <SelectItem value="Jamik Tashpulatov" data-oid="c9qsvk:">
                                        Jamik Tashpulatov
                                    </SelectItem>
                                    <SelectItem value="Emily Whalen" data-oid="ie_:xwb">
                                        Emily Whalen
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </form>
                </div>
                <SheetFooter
                    className="mt-auto flex gap-2 sm:flex-col sm:space-x-0"
                    data-oid="uef37wl"
                >
                    <Button className="w-full" data-oid="ltke2cn">
                        Submit
                    </Button>
                    <SheetClose asChild data-oid="zhga_zj">
                        <Button variant="outline" className="w-full" data-oid=":nbyr.7">
                            Done
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
