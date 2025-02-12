import React, { useEffect, useRef, useState } from "react";
import "./TableFooter.css";

const TableFooter = React.memo(
  (props) => {
    const { currentPage, totalPage, totalItems } = props.pageData;
    const pageNumRef = useRef();
    const [pageNum, setPageNum] = useState(1);

    useEffect(() => {
      setPageNum(currentPage);
    }, [currentPage]);

    const pageNumberChangeHandler = (e) => {
      setPageNum(e.target.value);
    };

    const goNextPageHandler = (e) => {
      if (+pageNum >= totalPage) return;
      props.onItems(+pageNum + 1);
    };

    const goBackPageHandler = (e) => {
      if (+pageNum <= 1) return;
      props.onItems(+pageNum - 1);
    };

    const goToPageNumberHandler = (e) => {
      if (+pageNumRef.current.value === +currentPage) return;
      props.onItems(pageNumRef.current.value);
    };

    return (
      <tfoot className="footer__table">
        <tr>
          <td colSpan={4}>
            Total: {totalItems} result(s) / {totalPage} Page(s)
          </td>
          <td colSpan={4}>
            <ul className="table__paginations">
              <li className="table__pagination prev">
                <span className={`table__pagination ${currentPage <= 1 || currentPage > totalPage ? "not-allow" : ""}`} onClick={goBackPageHandler}>
                  &lt;&lt; Prev
                </span>
              </li>

              <li className="table__pagination next">
                <span className={`table__pagination ${currentPage >= totalPage ? "not-allow" : ""}`} onClick={goNextPageHandler}>
                  Next &gt;&gt;
                </span>
              </li>

              <li className="table__pagination">
                <input placeholder="Page number" onChange={pageNumberChangeHandler} value={pageNum} type="number" ref={pageNumRef} min={1} max={totalPage} name="page number" id="" />

                <button onClick={goToPageNumberHandler} className="leads__btn goto" type=" button">
                  Go
                </button>
              </li>
            </ul>
          </td>
        </tr>
      </tfoot>
    );
  },
  (prevProps, nextProps) => prevProps.pageData === nextProps.pageData
);

export default TableFooter;
