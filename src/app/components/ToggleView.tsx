import { ButtonGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setViewMode } from '../redux/pokemonSlice';
import { RootState } from '../redux/store';
import '../styles/components/ViewToggle.scss';

const ViewToggle = () => {
  const dispatch = useDispatch();
  const { viewMode } = useSelector((state: RootState) => state.pokemon);
  
  return (
    <ButtonGroup className="view-toggle">
      <Button 
        variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
        onClick={() => dispatch(setViewMode('grid'))}
      >
        Grid View
      </Button>
      <Button 
        variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
        onClick={() => dispatch(setViewMode('list'))}
      >
        List View
      </Button>
    </ButtonGroup>
  );
};

export default ViewToggle;