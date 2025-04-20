import { useDispatch, useSelector } from 'react-redux';
import { setViewMode } from '../redux/pokemonSlice';
import { RootState } from '../redux/store';
import { FaTh, FaList } from 'react-icons/fa'; 
import '../styles/components/ViewToggle.scss';

const ViewToggle = () => {
  const dispatch = useDispatch();
  const { viewMode } = useSelector((state: RootState) => state.pokemon);

  return (
    <div className="view-toggle">
      <span className="view-toggle__label">View Mode:</span>
      <div className="view-toggle__options">
        <div
          className={`view-toggle__option ${viewMode === 'grid' ? 'view-toggle__option--active' : ''}`}
          onClick={() => dispatch(setViewMode('grid'))}
        >
          <FaTh />
        </div>
        <div
          className={`view-toggle__option ${viewMode === 'list' ? 'view-toggle__option--active' : ''}`}
          onClick={() => dispatch(setViewMode('list'))}
        >
          <FaList />
        </div>
      </div>
    </div>
  );
};

export default ViewToggle;
