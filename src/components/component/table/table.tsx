import "./table.scss";
import {type ChangeEvent, type RefObject, useEffect, useMemo, useRef, useState} from "react";
import Caret from "../carret/caret";

export interface Header {
    title: string;
    propertyName: string;
}

export interface TableProps<T extends object> {
    data: Array<T>;
    headers: Array<Header>;
    backgroundHeaderFooterColor?: string;
    backgroundBodyTable?: string;
    activeColor?: string;
    textPrimaryColor?: string;
    textSecondaryColor?: string;
    hoverColor?: string;
}

const ranges: Array<number> = [10, 25, 50, 100];

const Table = <T extends object>({data, headers, backgroundHeaderFooterColor = "#ffffff",
                                     backgroundBodyTable = "#f4f4f4", activeColor = "#a38cef", textPrimaryColor = "#FFFFFE",
                                     textSecondaryColor = "#2D2C2F", hoverColor = "#e8e0ff"}: TableProps<T>) => {

    const [maxValues, setMaxValues] = useState<number>(10);

    const [page, setPage] = useState<number>(1);

    const [sortBy, setSortBy] = useState<string>("");

    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    const [search, setSearch] = useState<string>("");

    const [totalData, setTotalData] = useState<number>(data.length);

    const [startIndex, setStartIndex] = useState<number>(0);

    const [endIndex, setEndIndex] = useState<number>(0);

    const [maxValueRangeOpened, setIsMaxValueRangeOpened] = useState<boolean>(false);

    const currentMaxValueRange: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.documentElement.style.setProperty("--table-background-header-and-footer-color", backgroundHeaderFooterColor);
        document.documentElement.style.setProperty("--table-background-body-color", backgroundBodyTable);
        document.documentElement.style.setProperty("--table-active-color", activeColor);
        document.documentElement.style.setProperty("--table-text-primary-color", textPrimaryColor);
        document.documentElement.style.setProperty("--table-text-secondary-color", textSecondaryColor);
        document.documentElement.style.setProperty("--table-hover-color", hoverColor);

        return () => {};

    }, [activeColor, backgroundBodyTable, backgroundHeaderFooterColor, hoverColor, textPrimaryColor, textSecondaryColor]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!currentMaxValueRange.current?.contains(event.target as Node)) {
                setIsMaxValueRangeOpened(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [currentMaxValueRange]);

    const totalPages = useMemo(() => {
        return Math.ceil(totalData / maxValues);
    }, [totalData, maxValues]);

    const receiveData: Array<T> = useMemo(() => {
        const sortedData: Array<T> = [...data];

        if (sortOrder !== null) {
            sortedData.sort((a: T, b: T) => {
                const aValue: T[keyof T] = a[sortBy as keyof T];
                const bValue: T[keyof T] = b[sortBy as keyof T];

                if (typeof aValue === "string" && typeof bValue === "string") {
                    return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }

                if (typeof aValue === "number" && typeof bValue === "number") {
                    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
                }

                if (aValue instanceof Date && bValue instanceof Date) {
                    return sortOrder === "asc" ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
                }

                return 0;
            })
        }

        let resultData: Array<T> = sortOrder !== null ? sortedData : [...data]

        if (search.length > 0) {
            resultData = resultData.filter((item: T) =>
                Object.entries(item).some(([key, value]: [string, unknown]) => {
                    if (key && typeof value === "string" || typeof value === "number") {
                        return value.toString().toLowerCase().includes(search.toLowerCase());
                    } else if (value instanceof Date) {
                        return value.toDateString().toLowerCase().includes(search.toLowerCase());
                    } else {
                        return false;
                    }
                })
            );
        } else {
            resultData = sortOrder !== null ? sortedData : [...data]
        }

        setTotalData(resultData.length);
        setStartIndex(resultData.indexOf(resultData[(page - 1) * maxValues]));

        if (page === totalPages) {
            setEndIndex(resultData.indexOf(resultData[(page * maxValues) - ((page * maxValues - totalData)) - 1]));
        } else {
            setEndIndex(resultData.indexOf(resultData[(page * maxValues)]))
        }

        return resultData.slice(startIndex, (page === totalPages ? endIndex + 1 : endIndex));
    }, [data, sortOrder, search, page, maxValues, totalPages, startIndex, endIndex, sortBy, totalData]);

    function handleSetPage(key: string) {
        if (key === 'first') {
            setPage(1);
        } else if (key === 'last') {
            setPage(totalPages);
        } else if (key === 'prev') {
            if (page === 1) return;
            setPage(page - 1);
        } else if (key === 'next') {
            if (page === totalPages) return;
            setPage(page + 1);
        }
    }

    function handleSetMaxValue(value: number) {
        setPage(1);
        setMaxValues(value);
        setIsMaxValueRangeOpened(false);
    }


    function sortData(propertyName: string): void {
        setSortBy(propertyName);

        if (sortOrder === 'desc') {
            setSortOrder(null);
        } else if (sortOrder === 'asc') {
            setSortOrder("desc");
        } else if (sortOrder === null) {
            setSortOrder("asc");
        }
        setPage(1);
    }

    function handleSearchItem(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    return (
        <div className="table-container">
            <div className="options-header">
                <div className="range-data">
                    <label>Show <span className="range-data-current"
                                      onClick={() => setIsMaxValueRangeOpened(!maxValueRangeOpened)}> {maxValues}</span>
                        {maxValueRangeOpened ? (
                            <div className="range-select" ref={currentMaxValueRange}>
                                {ranges.map((range: number, index: number) => (
                                    <div className="range-select-option"
                                         key={index}
                                         onClick={() => handleSetMaxValue(range)}
                                    >
                                        {range}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        entries
                    </label>
                </div>
                <input type="search" className="search-input" onChange={handleSearchItem} placeholder="Search"/>
            </div>
            <div className="table-and-footer">

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                    <tr>
                        {headers.map((header: Header, index: number) => (
                            <th key={index} className="header-item-content">
                                <div className="header-content-wrapper">
                                    <p>{header.title}</p>
                                    <div className="sort-header-container">
                                        {sortBy === header.propertyName && sortOrder !== null ? (
                                        <span className={`sort ${sortOrder === "asc" ? "up" : "down"}`}
                                              onClick={() => sortData(header.propertyName)}>
                                            <Caret svgName={"next-previous-sort"} />
                                        </span>
                                        ) : (
                                            <span className="sort" onClick={() => sortData(header.propertyName)}>
                                                <Caret svgName={"double"} />
                                        </span>
                                        )}
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {
                        receiveData && receiveData.length > 0 ? (receiveData.map((row: T, index: number) => (
                            <tr key={index}>
                                {Object.values(row).map((value: string | number | Date, i: number) => (
                                    <td key={i}>{value instanceof Date ? value.toDateString() : value}</td>
                                ))}
                            </tr>
                        ))) : <tr>
                            <td colSpan={9}>No data available.</td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
                <div className="footer-tab">
                    <span>Page {page} / {totalPages}</span>
                    <span>{data.indexOf(data[startIndex]) + 1}-{data.lastIndexOf(data[endIndex]) + (page === totalPages ? 1 : 0)} / {totalData}</span>
                    <span className="footer-tab-item" onClick={() => handleSetPage('first')}>
                        <Caret svgName={"first-last"} />
                    </span>
                    <span className="footer-tab-item" onClick={() => handleSetPage('prev')}>
                        <Caret svgName={"next-previous-sort"} className="footer-previous" />
                    </span>
                    <span className="footer-tab-item" onClick={() => handleSetPage('next')}>
                        <Caret svgName="next-previous-sort" className="footer-next" />
                    </span>
                    <span className="footer-tab-item" onClick={() => handleSetPage('last')}>
                        <Caret svgName={"first-last"} className="footer-last" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Table;