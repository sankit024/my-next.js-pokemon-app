import { Spinner } from 'react-bootstrap';
import '../styles/components/LoaddingSpinner.scss';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <div className="loading-spinner">
      <Spinner animation="border" role="status" variant="primary" />
      <span className="loading-text">{message}</span>
    </div>
  );
};

export default LoadingSpinner