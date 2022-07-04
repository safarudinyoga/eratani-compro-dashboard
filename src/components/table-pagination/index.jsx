import { Pagination } from 'antd'

import './pagination.sass'

const TablePagination = ({ pagination, go, showPageNumber, loading, style }) => {
  pagination.page = +pagination.page
  pagination.total = +pagination.total

  return (
    <div className='table-pagination' style={style}>
      <Pagination
        disabled={loading || !pagination.total}
        showQuickJumper
        current={pagination.page}
        total={pagination.total}
        onChange={(e) => go(e)}
      />
      {showPageNumber && (
        <div className="bottom-pagination-info">
          {/* Showing 1 to 10 of x entries */}
          Halaman <b>{pagination.total !== 0 ? pagination.page : 0}</b> dari{' '}
          <b>{pagination.total !== 0 ? Math.ceil(pagination.total / pagination.limit) : 0}</b>{' '}
          &nbsp;(<b>{pagination.total}</b> Data)
        </div>
      )}
    </div>
  )
}

export default TablePagination