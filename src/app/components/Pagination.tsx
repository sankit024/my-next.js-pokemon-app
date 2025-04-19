import { Pagination as BsPagination } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, fetchAllPokemon } from '../redux/pokemonSlice';
import { AppDispatch, RootState } from '../redux/store';
import '../styles/components/Pagination.scss';

const Pagination = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPage, totalPages } = useSelector((state: RootState) => state.pokemon);
  const { activeType } = useSelector((state: RootState) => state.types);
  
  // Only show pagination for 'all' Pokemon view
  if (activeType !== 'all') {
    return null;
  }
  
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchAllPokemon({ limit: 20, offset: (page - 1) * 20 }));
  };
  
  // Create pagination items
  const items = [];
  const maxItems = 5; // Show max 5 page numbers
  
  let startPage = Math.max(1, currentPage - Math.floor(maxItems / 2));
  const endPage = Math.min(totalPages, startPage + maxItems - 1);
  
  if (endPage - startPage + 1 < maxItems) {
    startPage = Math.max(1, endPage - maxItems + 1);
  }
  
  // Previous button
  items.push(
    <BsPagination.Prev 
      key="prev"
      disabled={currentPage === 1}
      onClick={() => handlePageChange(currentPage - 1)}
    />
  );
  
  // First page
  if (startPage > 1) {
    items.push(
      <BsPagination.Item 
        key={1} 
        active={1 === currentPage}
        onClick={() => handlePageChange(1)}
      >
        1
      </BsPagination.Item>
    );
    
    if (startPage > 2) {
      items.push(<BsPagination.Ellipsis key="ellipsis-1" />);
    }
  }
  
  // Page numbers
  for (let page = startPage; page <= endPage; page++) {
    items.push(
      <BsPagination.Item 
        key={page} 
        active={page === currentPage}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </BsPagination.Item>
    );
  }
  
  // Last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push(<BsPagination.Ellipsis key="ellipsis-2" />);
    }
    
    items.push(
      <BsPagination.Item 
        key={totalPages} 
        active={totalPages === currentPage}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </BsPagination.Item>
    );
  }
  
  // Next button
  items.push(
    <BsPagination.Next 
      key="next" 
      disabled={currentPage === totalPages}
      onClick={() => handlePageChange(currentPage + 1)}
    />
  );
  
  return (
    <div className="pagination-container">
      <BsPagination>{items}</BsPagination>
    </div>
  );
};

export default Pagination;